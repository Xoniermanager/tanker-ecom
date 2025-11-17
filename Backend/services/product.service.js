const mongoose = require("mongoose");
const { Types, startSession } = require("mongoose");
const productRepository = require("../repositories/product/product.repository");
const inventoryRepository = require("../repositories/product/inventory.repository");
const ProductCategoryRepository = require("../repositories/product/product-category.repository");
const customError = require("../utils/error");
const { generateSlugIfNeeded, generateBulkSlug } = require("../utils/slug");
const { PRODUCT_STATUS } = require("../constants/enums");
const productCategoryRepository = require("../repositories/product/product-category.repository");

const summaryFields = "";

class ProductService {
 
  async getAllProducts(page = 1, limit = 10, filters = {}) {
    const query = {};

    if (filters.category) {
      try {
        let categories;
        if (Array.isArray(filters.category)) {
          categories = filters.category;
        } else {
          categories = filters.category
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);
        }
        query.category = {
          $in: categories.map((item) => new Types.ObjectId(String(item))),
        };
      } catch (error) {
        throw customError("Invalid category ID", 400);
      }
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.id) {
      query._id = { $regex: filters.id, $options: "m" };
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }

    if (filters.brand) {
      query.brand = { $regex: `^${filters.brand}$`, $options: "i" };
    }

    return await productRepository.paginate(
      query,
      page,
      limit,
      { createdAt: -1 },
      null,
      summaryFields,
      [
        {
          path: "category",
          select: "_id name slug",
        },
        {
          path: "inventory",
          select: "_id quantity status salesCount",
        },
      ]
    );
  }


  async getProductBySlug(slug) {
    try {
      if (!slug || typeof slug !== "string") {
        throw customError("Invalid product slug", 400);
      }

      const product = await productRepository.findBySlug(slug, null, [
        {
          path: "category",
          select: "_id name slug",
        },
        {
          path: "inventory",
          select: "_id quantity status",
        },
      ]);

      if (!product) {
        throw customError("Product not found", 404);
      }

      return product.toObject();
    } catch (err) {
      throw err;
    }
  }

  async createProduct(data) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      data.slug = await generateSlugIfNeeded(
        data.name,
        data.slug,
        productRepository,
        session
      );

      const product = await productRepository.create(data, session);

      await inventoryRepository.create(
        { product: product._id, quantity: data.initialQuantity || 0 },
        session
      );

      await session.commitTransaction();
      return product;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async createBulkProducts(headers, data) {
    const session = await mongoose.startSession();
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    try {
      session.startTransaction();

      const headerMap = {};
      headers.forEach((header, index) => {
        const cleanHeader = header.toLowerCase().trim();
        if (cleanHeader.includes("part") || cleanHeader.includes("no."))
          headerMap.partNumber = index;
        if (cleanHeader.includes("name")) headerMap.name = index;
        if (cleanHeader.includes("category")) headerMap.category = index;
        if (cleanHeader.includes("regular") && cleanHeader.includes("price"))
          headerMap.regularPrice = index;
        if (cleanHeader.includes("selling") && cleanHeader.includes("price"))
          headerMap.sellingPrice = index;
        if (cleanHeader.includes("brand")) headerMap.brand = index;
        if (cleanHeader.includes("origin")) headerMap.origin = index;
        if (cleanHeader.includes("quantity")) headerMap.quantity = index;
        if (cleanHeader.includes("highlight")) headerMap.highlights = index;
        if (
          cleanHeader.includes("description") &&
          !cleanHeader.includes("short")
        )
          headerMap.description = index;
        if (
          cleanHeader.includes("short") &&
          cleanHeader.includes("description")
        )
          headerMap.shortDescription = index;
        if (cleanHeader.includes("delivery") && cleanHeader.includes("days"))
          headerMap.deliveryDays = index;

        if (cleanHeader.includes("shipping") && cleanHeader.includes("charge"))
          headerMap.shippingCharge = index;

        // if (cleanHeader.includes("height") && cleanHeader.includes("(m)")) {
        //   headerMap.height = index;
        // }
        // if (cleanHeader.includes("length") && cleanHeader.includes("(m)")) {
        //   headerMap.length = index;
        // }
        // if (cleanHeader.includes("width") && cleanHeader.includes("(m)")) {
        //   headerMap.width = index;
        // }
        // if (cleanHeader.includes("weight") && cleanHeader.includes("(kg)")) {
        //   headerMap.weight = index;
        // }
        // if (cleanHeader.includes("volume") && cleanHeader.includes("(m3)")) {
        //   headerMap.volume = index;
        // }
        // if (cleanHeader.includes("package") && cleanHeader.includes("type")) {
        //   headerMap.packTypeCode = index;
        // }
      });

      const categories = await ProductCategoryRepository.findAll(
        { status: true },
        null,
        { createdAt: -1 },
        session
      );
      const categoryMap = new Map(
        categories.map((cat) => [cat.name.toLowerCase(), cat._id])
      );

      const existingCatName = categories.map((item) => item.name);

      let csvCategories = [];

      for (let item of data) {
        csvCategories.push(item[2]);
      }

      const uniqueCat = [];

      for (let item of csvCategories) {
        if (uniqueCat.includes(item)) {
          continue;
        }
        if (!item || item.toLowerCase() === "n/a") {
          continue;
        }
        uniqueCat.push(item);
      }

      const newCategories = [];

      for (let item of uniqueCat) {
        if (existingCatName.includes(item)) {
          continue;
        }
        console.log("item: ", item);
        const slug = await generateSlugIfNeeded(
          item,
          null,
          productCategoryRepository,
          session
        );
        const cat = {
          name: item,
          slug,
        };
        newCategories.push(cat);
      }

      

      if (newCategories.length > 0) {
        const createNewCat = await productCategoryRepository.bulkCreate(
          newCategories,
          session
        );
        if (!createNewCat || createNewCat.length === 0) {
          console.log("error: ", createNewCat);
          throw customError("New categories creation failed", 400);
        }
        createNewCat.forEach((cat) => {
          categoryMap.set(cat.name.toLowerCase(), cat._id);
        });
      }

      const newProducts = [];
      const productInventory = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowNumber = i + 2;

        try {
          const productData = {
            partNumber: row[headerMap.partNumber]?.trim(),
            name: row[headerMap.name]?.trim(),
            categoryName:
              row[headerMap.category]?.trim().toLowerCase() === "n/a"
                ? "other"
                : row[headerMap.category]?.trim(),
            regularPrice: parseFloat(row[headerMap.regularPrice]) || 0,
            sellingPrice: parseFloat(row[headerMap.sellingPrice]) || 0,
            brand: row[headerMap.brand]?.trim(),
            origin: row[headerMap.origin]?.trim(),
            quantity: parseInt(row[headerMap.quantity]) || 0,
            highlights: row[headerMap.highlights]?.trim(),
            description: row[headerMap.description]?.trim(),
            shortDescription: row[headerMap.shortDescription]?.trim(),
            deliveryDays: row[headerMap.deliveryDays]?.toString() || "1",
            shippingCharge: row[headerMap.shippingCharge]
            // specifications: {
            //   height: row[headerMap.height]?.trim() || "0",
            //   length: row[headerMap.length]?.trim() || "0",
            //   width: row[headerMap.width]?.trim() || "0",
            //   weight: row[headerMap.weight]?.trim() || "0",
            //   volume: row[headerMap.volume]?.trim() || "0",
            //   packTypeCode: row[headerMap.packTypeCode]?.trim()
            // },
            
          };

          if(!productData.partNumber){
            throw new Error(`Product part number is required on row number ${rowNumber}`)
          }

          if (!productData.name) {
            throw new Error(`Product name is required on row number ${rowNumber}`);
          }

          if(!productData.shippingCharge){
            throw new Error(`Product shipping price required on row number ${rowNumber}`);
          }

          // if(!productData.specifications.height){
          //   throw new Error(`Product height is required on row number ${rowNumber}`)
          // }
          // if(!productData.specifications.length){
          //   throw new Error(`Product length is required on row number ${rowNumber}`)
          // }
          // if(!productData.specifications.volume){
          //   throw new Error(`Product length is volume on row number ${rowNumber}`)
          // }
          // if(!productData.specifications.weight){
          //   throw new Error(`Product length is weight on row number ${rowNumber}`)
          // }
          // if(!productData.specifications.width){
          //   throw new Error(`Product length is width on row number ${rowNumber}`)
          // }
          // if(!productData.specifications.packTypeCode){
          //   throw new Error(
          //     `Product package Type not define in ${rowNumber}`
          //   )
          // }

          if (!productData.categoryName) {
            throw new Error(`Category is required on row number ${rowNumber}`);
          }

          if (!productData.brand) {
            throw new Error(`Brand is required on row number ${rowNumber}`);
          }

          //   if (!productData.description) {
          //     throw new Error(`Description is required`);
          //   }

          //   if (!productData.shortDescription) {
          //     throw new Error(`Short description is required`);
          //   }

          if (productData.regularPrice <= 0) {
            throw new Error(`Valid regular price is required on row number ${rowNumber}`);
          }

          if (productData.sellingPrice <= 0) {
            throw new Error(`Valid selling price is required on row number ${rowNumber}`);
          }

          const categoryId = categoryMap.get(
            productData.categoryName.toLowerCase()
          );
          if (!categoryId) {
            throw new Error(
              `Category "${productData.categoryName}" not found. Please use valid category names on row number ${rowNumber}.`
            );
          }

          

          const highlightsArray = productData.highlights
            ? productData.highlights
                .split(";")
                .map((h) => h.trim())
                .filter((h) => h)
            : [];

          if (highlightsArray.length > 10) {
            throw new Error(
              `Maximum 10 highlights allowed. Found ${highlightsArray.length} on row number ${rowNumber}`
            );
          }

          const finalProductData = {
            partNumber: productData.partNumber,
            name: productData.name,
            category: categoryId,
            regularPrice: productData.regularPrice,
            sellingPrice: productData.sellingPrice,
            brand: productData.brand,
            origin: productData.origin || "",
            highlights: highlightsArray,
            description: productData.description,
            shortDescription: productData.shortDescription,
            deliveryDays: productData.deliveryDays,
            initialQuantity: productData.quantity,
            images: [
              {
                source: "https://placehold.co/400x300?text=No+Image",
                type: "image",
              },
            ],
            status: PRODUCT_STATUS.ACTIVE,
            measurements: [],
            shipping: "",
            shippingCharge: Math.round(productData.shippingCharge * 100) / 100,
            // specifications: {
            //   height: productData.specifications.height,
            //   length: productData.specifications.length,
            //   width: productData.specifications.width,
            //   weight: productData.specifications.weight,
            //   volume: productData.specifications.volume,
            //   packTypeCode: productData.specifications.packTypeCode
            // },
            seo: {
              metaTitle: productData.name,
              metaDescription: productData.shortDescription,
              keywords: [productData.brand, productData.categoryName],
            },
          };

          finalProductData.slug = await generateBulkSlug(
            finalProductData.name,
            null,
            productRepository,
            session
          );

          newProducts.push(finalProductData);
          console.log("final product: ", finalProductData)
          productInventory.push({
            rowNumber,
            quantity: productData.quantity,
          });

         
        } catch (rowError) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            data: row[headerMap.name] || `Row ${rowNumber}`,
            error: rowError.message,
          });

          console.error(`Error processing row ${rowNumber}:`, rowError.message);
        }
      }

      const createdProducts = await productRepository.bulkCreate(
        newProducts,
        session
      );
      console.log("created products: ", createdProducts)
      console.log("new products: ", newProducts)
      if (!createdProducts || createdProducts.length === 0) {
        throw customError("Product bulk creation failed", 400);
      }

      const inventoryData = createdProducts.map((product, index) => ({
        product: product._id,
        quantity: productInventory[index].quantity,
      }));


      const inventoryCreation =  await inventoryRepository.bulkCreate(inventoryData, session);
      if(!inventoryCreation || inventoryCreation.length === 0){
        throw customError("Inventory bulk creation failed")
      }

      results.successful = createdProducts.length;

      await session.commitTransaction();
      return results;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  
  async updateProduct(id, data) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const existingProduct = await productRepository.findById(id, session);

      if (!existingProduct) {
        throw customError("Product not exist", 404);
      }

      if (String(existingProduct.name).trim() !== String(data.name).trim()) {
        data.slug = await generateSlugIfNeeded(
          data.name,
          null,
          productRepository,
          session
        );
      }

      const updatedProduct = await productRepository.update(id, data, session);

      await session.commitTransaction();
      return updatedProduct;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

 
  async deleteProduct(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await inventoryRepository.deleteByProduct(id, session);
      const deleted = await productRepository.deleteById(id, session);

      await session.commitTransaction();
      return deleted;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  deleteBulkProducts = async (ids) => {
    const session = await startSession();
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw customError("please provide an array of product IDs", 400);
      }
      const validIds = ids.filter((item) => Types.ObjectId.isValid(item));
      console.log("valid ids: ", validIds);
      if (ids.length !== validIds.length) {
        throw customError("Some ids are invalid", 400);
      }
      session.startTransaction();

      await inventoryRepository.bulkDeleteByProductIds(validIds, session);
      const bulkDelete = await productRepository.bulkDelete(validIds, session);
      if (!bulkDelete) {
        throw customError("Bulk deletion failed", 400);
      }
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

 
  async toggleProductStatus(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw customError("Invalid product ID");
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw customError("Product not found");
    }

    const newStatus = product.status === "active" ? "inactive" : "active";
    product.status = newStatus;
    await product.save();

    return newStatus;
  }

 
  async getBrandsForFilter() {
    return productRepository.getAllUniqueBrands();
  }
}

module.exports = new ProductService();
