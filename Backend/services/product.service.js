const mongoose = require("mongoose");
const { Types } = require("mongoose");
const productRepository = require("../repositories/product/product.repository");
const inventoryRepository = require("../repositories/product/inventory.repository");
const ProductCategoryRepository = require("../repositories/product/product-category.repository")
const customError = require("../utils/error");
const { generateSlugIfNeeded } = require("../utils/slug");
const { PRODUCT_STATUS } = require("../constants/enums");

const summaryFields = "";

class ProductService {
    /**
     * Retrieves paginated products with optional filters.
     * @param {number} [page=1] - The page number for pagination.
     * @param {number} [limit=10] - Number of products per page.
     * @param {object} [filters={}] - Filters (category, status, name).
     * @returns {Promise<object>} Paginated list of products.
     */
    async getAllProducts(page = 1, limit = 10, filters = {}) {
        const query = {};

        if (filters.category) {
        try {
            let categories;
            if (Array.isArray(filters.category)) {
                categories = filters.category;
            } else {
                categories = filters.category.split(',').map(id => id.trim()).filter(id => id);
            }
            query.category = { $in: categories.map(item => new Types.ObjectId(String(item)))};
            
        } catch (error) {
            throw customError("Invalid category ID", 400);
        }
    }


        if (filters.status) {
            query.status = filters.status;
        }

        if(filters.id){
            query._id = {$regex: filters.id, $options: "m"}
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
                }
            ]
        );
    }

    /**
     * Fetches a single product by its slug and includes inventory quantity.
     * @param {string} slug - The product slug.
     * @returns {Promise<object>} Product details with inventory quantity.
     */
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
                }
            ]);

            if (!product) {
                throw customError("Product not found", 404);
            }

            return product.toObject()
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
        errors: []
    };

    try {
        session.startTransaction();

        const headerMap = {};
        headers.forEach((header, index) => {
            const cleanHeader = header.toLowerCase().trim();
            if (cleanHeader.includes('s.no') || cleanHeader.includes('serial')) headerMap.sno = index;
            if (cleanHeader.includes('name')) headerMap.name = index;
            if (cleanHeader.includes('category')) headerMap.category = index;
            if (cleanHeader.includes('regular') && cleanHeader.includes('price')) headerMap.regularPrice = index;
            if (cleanHeader.includes('selling') && cleanHeader.includes('price')) headerMap.sellingPrice = index;
            if (cleanHeader.includes('brand')) headerMap.brand = index;
            if (cleanHeader.includes('origin')) headerMap.origin = index;
            if (cleanHeader.includes('quantity')) headerMap.quantity = index;
            if (cleanHeader.includes('highlight')) headerMap.highlights = index;
            if (cleanHeader.includes('description') && !cleanHeader.includes('short')) headerMap.description = index;
            if (cleanHeader.includes('short') && cleanHeader.includes('description')) headerMap.shortDescription = index;
            if (cleanHeader.includes('delivery') && cleanHeader.includes('days')) headerMap.deliveryDays = index;
        });


        const categories = await ProductCategoryRepository.findAll({ status: true }, null, {createdAt: -1}, session);
        const categoryMap = new Map(categories.map(cat => [cat.name.toLowerCase(), cat._id]));

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNumber = i + 2; 

            try {

                const productData = {
                    name: row[headerMap.name]?.trim(),
                    categoryName: row[headerMap.category]?.trim(),
                    regularPrice: parseFloat(row[headerMap.regularPrice]) || 0,
                    sellingPrice: parseFloat(row[headerMap.sellingPrice]) || 0,
                    brand: row[headerMap.brand]?.trim(),
                    origin: row[headerMap.origin]?.trim(),
                    quantity: parseInt(row[headerMap.quantity]) || 0,
                    highlights: row[headerMap.highlights]?.trim(),
                    description: row[headerMap.description]?.trim(),
                    shortDescription: row[headerMap.shortDescription]?.trim(),
                    deliveryDays: row[headerMap.deliveryDays]?.toString() || "1"
                };

               
                if (!productData.name) {
                    throw new Error(`Product name is required`);
                }

                if (!productData.categoryName) {
                    throw new Error(`Category is required`);
                }

                if (!productData.brand) {
                    throw new Error(`Brand is required`);
                }

                if (!productData.description) {
                    throw new Error(`Description is required`);
                }

                if (!productData.shortDescription) {
                    throw new Error(`Short description is required`);
                }

                if (productData.regularPrice <= 0) {
                    throw new Error(`Valid regular price is required`);
                }

                if (productData.sellingPrice <= 0) {
                    throw new Error(`Valid selling price is required`);
                }

                const categoryId = categoryMap.get(productData.categoryName.toLowerCase());
                if (!categoryId) {
                    throw new Error(`Category "${productData.categoryName}" not found. Please use valid category names.`);
                }

                const highlightsArray = productData.highlights 
                    ? productData.highlights.split(';').map(h => h.trim()).filter(h => h)
                    : [];

                if (highlightsArray.length > 10) {
                    throw new Error(`Maximum 10 highlights allowed. Found ${highlightsArray.length}`);
                }

                const finalProductData = {
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
                    images: [{ 
                        source: "https://placehold.co/400x300?text=No+Image",
                        type: "image" 
                    }],
                    status: PRODUCT_STATUS.ACTIVE, 
                    measurements: [], 
                    shipping: "", 
                    seo: {
                        metaTitle: productData.name,
                        metaDescription: productData.shortDescription,
                        keywords: [productData.brand, productData.categoryName]
                    }
                };

                finalProductData.slug = await generateSlugIfNeeded(
                    finalProductData.name,
                    null,
                    productRepository,
                    session
                );

                const product = await productRepository.create(finalProductData, session);

                await inventoryRepository.create(
                    { product: product._id, quantity: finalProductData.initialQuantity },
                    session
                );

                results.successful++;

            } catch (rowError) {
                results.failed++;
                results.errors.push({
                    row: rowNumber,
                    data: row[headerMap.name] || `Row ${rowNumber}`,
                    error: rowError.message
                });

                console.error(`Error processing row ${rowNumber}:`, rowError.message);
            }
        }

        await session.commitTransaction();
        return results;

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}
    /**
     * Updates an existing product by ID.
     * @param {string} id - Product ID.
     * @param {object} data - Updated product fields.
     * @returns {Promise<object>} Updated product.
     */
    async updateProduct(id, data) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            const existingProduct = await productRepository.findById(id, session)

            if(!existingProduct){
                throw customError("Product not exist", 404)
            }

            if(String(existingProduct.name).trim() !== String(data.name).trim()){
                data.slug = await generateSlugIfNeeded(data.name, null, productRepository, session)
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

    /**
     * Deletes a product and its inventory entry.
     * @param {string} id - Product ID.
     * @returns {Promise<object>} Deleted product.
     */
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

    /**
     * Toggles a product's status between 'active' and 'inactive'.
     * @param {string} productId - Product ID.
     * @returns {Promise<string>} New product status.
     */
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

    /**
     * Fetch all unique brands from products.
     * @returns {Promise<string[]>} List of unique brand names.
     */
    async getBrandsForFilter() {
        return productRepository.getAllUniqueBrands();
    }
}

module.exports = new ProductService();
