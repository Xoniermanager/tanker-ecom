// const AWS = require("aws-sdk");
// const csv = require("csv-parser");
// const fs = require("fs").promises;
// const fsSync = require("fs");
// const mongoose = require("mongoose");
// const cron = require("node-cron");
// const { BUCKET_NAME, PRODUCT_STATUS } = require("../constants/enums");
// const { generateBulkSlug } = require("../utils/slug");
// const productRepository = require("../repositories/product/product.repository");
// const inventoryRepository = require("../repositories/product/inventory.repository");
// const productCategoryRepository = require("../repositories/product/product-category.repository");

// AWS.config.update({ region: process.env.AWS_REGION });

// const s3 = new AWS.S3();

// const CONFIG = {
//   INPUT_BUCKET: BUCKET_NAME.INPUT,
//   COMPLETE_BUCKET: BUCKET_NAME.COMPLETE,
//   FAILED_BUCKET: BUCKET_NAME.FAILED,
//   INPUT_PREFIX: "input/",
//   COMPLETE_PREFIX: "completed/",
//   FAILED_PREFIX: "failed/",
//   TMP_DIR: "/tmp",
//   CRON_SCHEDULE: "* * * * *",
// };

// const DUMMY_IMAGE_URL = "https://placehold.co/400x300?text=No+Image";

// // CSV Header Mapper
// class CSVHeaderMapper {
//   static mapHeaders(headers) {
//     const headerMap = {};
    
//     headers.forEach((header, index) => {
//       const cleanHeader = header.toLowerCase().trim();
      
//       if (cleanHeader.includes("part") || cleanHeader.includes("no."))
//         headerMap.partNumber = index;
//       if (cleanHeader.includes("name") && !cleanHeader.includes("category"))
//         headerMap.name = index;
//       if (cleanHeader.includes("category")) 
//         headerMap.category = index;
//       if (cleanHeader.includes("regular") && cleanHeader.includes("price"))
//         headerMap.regularPrice = index;
//       if (cleanHeader.includes("selling") && cleanHeader.includes("price"))
//         headerMap.sellingPrice = index;
//       if (cleanHeader.includes("brand")) 
//         headerMap.brand = index;
//       if (cleanHeader.includes("origin")) 
//         headerMap.origin = index;
//       if (cleanHeader.includes("quantity")) 
//         headerMap.quantity = index;
//       if (cleanHeader.includes("highlight")) 
//         headerMap.highlights = index;
//       if (cleanHeader.includes("description") && !cleanHeader.includes("short"))
//         headerMap.description = index;
//       if (cleanHeader.includes("short") && cleanHeader.includes("description"))
//         headerMap.shortDescription = index;
//       if (cleanHeader.includes("delivery") && cleanHeader.includes("days"))
//         headerMap.deliveryDays = index;
//       if (cleanHeader.includes("shipping") && cleanHeader.includes("charge"))
//         headerMap.shippingCharge = index;
//     });

//     return headerMap;
//   }
// }


// class ProductValidator {
//   static validate(productData, rowNumber) {
//     const errors = [];

//     if (!productData.partNumber) {
//       errors.push(`Product part number is required on row ${rowNumber}`);
//     }

//     if (!productData.name) {
//       errors.push(`Product name is required on row ${rowNumber}`);
//     }

//     if (!productData.categoryName) {
//       errors.push(`Category is required on row ${rowNumber}`);
//     }

//     if (!productData.brand) {
//       errors.push(`Brand is required on row ${rowNumber}`);
//     }

//     if (productData.shippingCharge === undefined || productData.shippingCharge === null) {
//       errors.push(`Shipping charge is required on row ${rowNumber}`);
//     }

//     if (productData.regularPrice <= 0) {
//       errors.push(`Valid regular price is required on row ${rowNumber}`);
//     }

//     if (productData.sellingPrice <= 0) {
//       errors.push(`Valid selling price is required on row ${rowNumber}`);
//     }

//     // Validate highlights limit
//     if (productData.highlightsArray && productData.highlightsArray.length > 10) {
//       errors.push(
//         `Maximum 10 highlights allowed. Found ${productData.highlightsArray.length} on row ${rowNumber}`
//       );
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     };
//   }

//   static parseRowData(row, headerMap) {
//     const highlightsArray = row[headerMap.highlights]
//       ? row[headerMap.highlights]
//           .split(";")
//           .map((h) => h.trim())
//           .filter((h) => h)
//       : [];

//     return {
//       partNumber: row[headerMap.partNumber]?.trim(),
//       name: row[headerMap.name]?.trim(),
//       categoryName:
//         row[headerMap.category]?.trim().toLowerCase() === "n/a"
//           ? "other"
//           : row[headerMap.category]?.trim(),
//       regularPrice: parseFloat(row[headerMap.regularPrice]) || 0,
//       sellingPrice: parseFloat(row[headerMap.sellingPrice]) || 0,
//       brand: row[headerMap.brand]?.trim(),
//       origin: row[headerMap.origin]?.trim(),
//       quantity: parseInt(row[headerMap.quantity]) || 0,
//       highlights: row[headerMap.highlights]?.trim(),
//       highlightsArray,
//       description: row[headerMap.description]?.trim(),
//       shortDescription: row[headerMap.shortDescription]?.trim(),
//       deliveryDays: row[headerMap.deliveryDays]?.toString() || "10",
//       shippingCharge: parseFloat(row[headerMap.shippingCharge]) || 0,
//     };
//   }

//   static buildFinalProduct(productData, categoryId) {
//     return {
//       partNumber: productData.partNumber,
//       name: productData.name,
//       category: categoryId,
//       regularPrice: productData.regularPrice,
//       sellingPrice: productData.sellingPrice,
//       brand: productData.brand,
//       origin: productData.origin || "Not Found",
//       highlights: productData.highlightsArray,
//       description: productData.description,
//       shortDescription: productData.shortDescription,
//       deliveryDays: productData.deliveryDays,
//       images: [
//         {
//           source: DUMMY_IMAGE_URL,
//           type: "image",
//         },
//       ],
//       status: PRODUCT_STATUS.ACTIVE,
//       measurements: [],
//       shipping: "",
//       shippingCharge: Math.round(productData.shippingCharge * 100) / 100,
//       seo: {
//         metaTitle: productData.name,
//         metaDescription: productData.shortDescription || productData.name,
//         keywords: [productData.brand, productData.categoryName],
//       },
//     };
//   }
// }

// // Category Manager
// class CategoryManager {
//   static async ensureCategories(csvCategories, session) {
//     // Get existing categories
//     const categories = await productCategoryRepository.findAll(
//       { status: true },
//       null,
//       { createdAt: -1 },
//       session
//     );

//     const categoryMap = new Map(
//       categories.map((cat) => [cat.name.toLowerCase(), cat._id])
//     );

//     const existingCatNames = categories.map((item) => item.name);

//     // Find unique categories from CSV
//     const uniqueCsvCategories = [...new Set(csvCategories)]
//       .filter((cat) => cat && cat.toLowerCase() !== "n/a")
//       .map((cat) => cat.trim());

//     // Identify new categories to create
//     const newCategories = [];
//     for (const catName of uniqueCsvCategories) {
//       if (!existingCatNames.includes(catName)) {
//         const slug = await generateBulkSlug(catName);
//         newCategories.push({
//           name: catName,
//           slug,
//           status: true,
//         });
//       }
//     }

//     // Create new categories if needed
//     if (newCategories.length > 0) {
//       console.log(`Creating ${newCategories.length} new categories...`);
//       const createdCategories = await productCategoryRepository.bulkCreate(
//         newCategories,
//         session
//       );

//       if (!createdCategories || createdCategories.length === 0) {
//         throw new Error("New categories creation failed");
//       }

//       // Add new categories to the map
//       createdCategories.forEach((cat) => {
//         categoryMap.set(cat.name.toLowerCase(), cat._id);
//       });

//       console.log(` Created ${createdCategories.length} new categories`);
//     }

//     return categoryMap;
//   }
// }


// class S3Manager {
//   static async downloadFile(bucket, key) {
//     try {
//       const params = { Bucket: bucket, Key: key };
//       const data = await s3.getObject(params).promise();

//       const filename = key.split("/").pop();
//       const localPath = `${CONFIG.TMP_DIR}/${filename}`;

//       await fs.writeFile(localPath, data.Body);
//       console.log(`Downloaded: ${key} to ${localPath}`);

//       return localPath;
//     } catch (error) {
//       console.error(`Failed to download ${key}:`, error.message);
//       throw error;
//     }
//   }

//   static async moveFile(sourceKey, destinationBucket, destinationPrefix) {
//     try {
//       const filename = sourceKey.split("/").pop();
//       const destinationKey = `${destinationPrefix}${filename}`;

//       await s3
//         .copyObject({
//           Bucket: destinationBucket,
//           CopySource: `${CONFIG.INPUT_BUCKET}/${sourceKey}`,
//           Key: destinationKey,
//         })
//         .promise();

//       console.log(`Copied to: ${destinationBucket}/${destinationKey}`);

//       await s3
//         .deleteObject({
//           Bucket: CONFIG.INPUT_BUCKET,
//           Key: sourceKey,
//         })
//         .promise();

//       console.log(`Deleted from source: ${sourceKey}`);
//     } catch (error) {
//       console.error(`Failed to move file ${sourceKey}:`, error.message);
//       throw error;
//     }
//   }

//   static async listInputFiles() {
//     try {
//       const data = await s3
//         .listObjectsV2({
//           Bucket: CONFIG.INPUT_BUCKET,
//           Prefix: CONFIG.INPUT_PREFIX,
//         })
//         .promise();

//       const csvFiles = (data.Contents || [])
//         .filter((item) => item.Key.endsWith(".csv") && item.Size > 0)
//         .map((item) => item.Key);

//       return csvFiles;
//     } catch (error) {
//       console.error("Failed to list input files:", error.message);
//       throw error;
//     }
//   }
// }


// class CSVProcessor {
//   static async processCSV(filePath) {
//     return new Promise((resolve, reject) => {
//       const rows = [];
//       let headers = null;

//       fsSync
//         .createReadStream(filePath)
//         .pipe(csv({ skipEmptyLines: true, trim: true }))
//         .on("headers", (headerList) => {
//           headers = headerList;
//         })
//         .on("data", (row) => {
//           rows.push(row);
//         })
//         .on("end", () => {
//           console.log(`\n=== CSV Read Complete ===`);
//           console.log(`Headers: ${headers ? headers.length : 0}`);
//           console.log(`Total rows: ${rows.length}`);
//           resolve({ headers, rows });
//         })
//         .on("error", (error) => {
//           console.error("CSV parsing error:", error);
//           reject(error);
//         });
//     });
//   }

//   static async processProductsFromCSV(headers, rows, session) {
//     const results = {
//       successful: 0,
//       failed: 0,
//       errors: [],
//       validProducts: 0,
//       invalidProducts: 0,
//     };

//     try {
      
//       const headerMap = CSVHeaderMapper.mapHeaders(headers);
//       console.log("Header mapping:", headerMap);

      
//       const csvCategories = rows
//         .map((row) => Object.values(row)[headerMap.category])
//         .filter((cat) => cat && cat.trim());


//       const categoryMap = await CategoryManager.ensureCategories(
//         csvCategories,
//         session
//       );


//       const newProducts = [];
//       const productInventory = [];

//       for (let i = 0; i < rows.length; i++) {
//         const row = Object.values(rows[i]);
//         const rowNumber = i + 2; 

//         try {
    
//           const productData = ProductValidator.parseRowData(row, headerMap);


//           const validation = ProductValidator.validate(productData, rowNumber);

//           if (!validation.isValid) {
//             results.failed++;
//             results.invalidProducts++;
//             results.errors.push({
//               row: rowNumber,
//               data: productData.name || `Row ${rowNumber}`,
//               error: validation.errors.join("; "),
//             });
//             console.warn(
//               `Row ${rowNumber} validation failed:`,
//               validation.errors.join("; ")
//             );
//             continue;
//           }


//           const categoryId = categoryMap.get(
//             productData.categoryName.toLowerCase()
//           );

//           if (!categoryId) {
//             throw new Error(
//               `Category "${productData.categoryName}" not found on row ${rowNumber}`
//             );
//           }

         
//           const finalProduct = ProductValidator.buildFinalProduct(
//             productData,
//             categoryId
//           );

    
//           finalProduct.slug = await generateBulkSlug(finalProduct.name);

//           newProducts.push(finalProduct);
//           productInventory.push({
//             rowNumber,
//             quantity: productData.quantity,
//           });

//           results.validProducts++;
//         } catch (rowError) {
//           results.failed++;
//           results.invalidProducts++;
//           results.errors.push({
//             row: rowNumber,
//             data: row[headerMap.name] || `Row ${rowNumber}`,
//             error: rowError.message,
//           });
//           console.error(`Error processing row ${rowNumber}:`, rowError.message);
//         }
//       }

//       if (newProducts.length === 0) {
//         console.warn("No valid products to insert");
//         return results;
//       }

//       console.log(`\nInserting ${newProducts.length} products...`);

   
//       const createdProducts = await productRepository.bulkCreate(
//         newProducts,
//         session
//       );

//       if (!createdProducts || createdProducts.length === 0) {
//         throw new Error("Product bulk creation failed");
//       }

//       console.log(`✓ Inserted ${createdProducts.length} products`);

//       // Create inventory records
//       const inventoryData = createdProducts.map((product, index) => ({
//         product: product._id,
//         quantity: productInventory[index].quantity,
//         reserved: 0,
//         available: productInventory[index].quantity,
//       }));

//       const inventoryCreation = await inventoryRepository.bulkCreate(
//         inventoryData,
//         session
//       );

//       if (!inventoryCreation || inventoryCreation.length === 0) {
//         throw new Error("Inventory bulk creation failed");
//       }

//       console.log(`Created ${inventoryCreation.length} inventory records`);

//       results.successful = createdProducts.length;

//       return results;
//     } catch (error) {
//       console.error("Error processing products from CSV:", error);
//       throw error;
//     }
//   }
// }

// // Main Job Logic
// class ProductImportJob {
//   constructor() {
//     this.stats = {
//       totalProcessed: 0,
//       successful: 0,
//       failed: 0,
//       validProducts: 0,
//       invalidProducts: 0,
//     };
//   }

//   async processFile(fileKey) {
//     let localFilePath = null;
//     const session = await mongoose.startSession();

//     try {
//       console.log(`\n${"=".repeat(60)}`);
//       console.log(`Processing: ${fileKey}`);
//       console.log(`${"=".repeat(60)}`);

//       session.startTransaction();

//       localFilePath = await S3Manager.downloadFile(CONFIG.INPUT_BUCKET, fileKey);

//       const { headers, rows } = await CSVProcessor.processCSV(localFilePath);

//       if (!headers || headers.length === 0) {
//         throw new Error("CSV file has no headers");
//       }

//       if (!rows || rows.length === 0) {
//         console.warn(`No data rows found in ${fileKey}`);
//         await session.abortTransaction();
//         await S3Manager.moveFile(
//           fileKey,
//           CONFIG.FAILED_BUCKET,
//           CONFIG.FAILED_PREFIX
//         );
//         this.stats.failed++;
//         return;
//       }


//       const results = await CSVProcessor.processProductsFromCSV(
//         headers,
//         rows,
//         session
//       );

//       this.stats.validProducts += results.validProducts;
//       this.stats.invalidProducts += results.invalidProducts;

//       if (results.successful === 0) {
//         console.warn(`No products were successfully imported from ${fileKey}`);
        
//         if (results.errors.length > 0) {
//           console.warn("\nErrors encountered:");
//           results.errors.slice(0, 10).forEach((err) => {
//             console.warn(`  Row ${err.row}: ${err.error}`);
//           });
//         }

//         await session.abortTransaction();
//         await S3Manager.moveFile(
//           fileKey,
//           CONFIG.FAILED_BUCKET,
//           CONFIG.FAILED_PREFIX
//         );
//         this.stats.failed++;
//         return;
//       }

//       // Commit transaction
//       await session.commitTransaction();

//       // Move to completed bucket
//       await S3Manager.moveFile(
//         fileKey,
//         CONFIG.COMPLETE_BUCKET,
//         CONFIG.COMPLETE_PREFIX
//       );

//       console.log(`\n✓ Successfully processed: ${fileKey}`);
//       console.log(`  Products imported: ${results.successful}`);
//       console.log(`  Rows failed: ${results.failed}`);
      
//       this.stats.successful++;
//     } catch (error) {
//       console.error(`\n✗ Failed to process ${fileKey}:`, error.message);

//       // Abort transaction
//       await session.abortTransaction();

//       // Move to failed bucket
//       try {
//         await S3Manager.moveFile(
//           fileKey,
//           CONFIG.FAILED_BUCKET,
//           CONFIG.FAILED_PREFIX
//         );
//       } catch (moveError) {
//         console.error(`Failed to move file to failed bucket:`, moveError.message);
//       }

//       this.stats.failed++;
//     } finally {
//       // End session
//       session.endSession();

//       // Cleanup local file
//       if (localFilePath) {
//         try {
//           await fs.unlink(localFilePath);
//           console.log(`Cleaned up: ${localFilePath}`);
//         } catch (unlinkError) {
//           console.error(`Failed to cleanup ${localFilePath}:`, unlinkError.message);
//         }
//       }
//     }
//   }

//   async run() {
//     const startTime = Date.now();
//     console.log(`\n${"=".repeat(60)}`);
//     console.log(`Job started at: ${new Date().toISOString()}`);
//     console.log(`${"=".repeat(60)}`);

//     this.stats = {
//       totalProcessed: 0,
//       successful: 0,
//       failed: 0,
//       validProducts: 0,
//       invalidProducts: 0,
//     };

//     try {
//       const files = await S3Manager.listInputFiles();

//       if (files.length === 0) {
//         console.log("No new CSV files found in input bucket");
//         return;
//       }

//       console.log(`Found ${files.length} CSV file(s) to process`);
//       this.stats.totalProcessed = files.length;

//       for (const fileKey of files) {
//         await this.processFile(fileKey);
//       }
//     } catch (error) {
//       console.error("Job execution error:", error);
//     } finally {
//       const duration = ((Date.now() - startTime) / 1000).toFixed(2);
//       console.log(`\n${"=".repeat(60)}`);
//       console.log(`Job Summary`);
//       console.log(`${"=".repeat(60)}`);
//       console.log(`Duration: ${duration}s`);
//       console.log(`Total files: ${this.stats.totalProcessed}`);
//       console.log(`Successful files: ${this.stats.successful}`);
//       console.log(`Failed files: ${this.stats.failed}`);
//       console.log(`Valid products imported: ${this.stats.validProducts}`);
//       console.log(`Invalid products skipped: ${this.stats.invalidProducts}`);
//       console.log(`${"=".repeat(60)}\n`);
//     }
//   }
// }

// // Initialize job
// const job = new ProductImportJob();

// // Schedule cron job
// cron.schedule(CONFIG.CRON_SCHEDULE, async () => {
//   console.log("\n📋 Cron job triggered");
//   await job.run();
// });

// console.log(`\n🚀 Product Import Scheduler Started`);
// console.log(`Schedule: ${CONFIG.CRON_SCHEDULE} (Every minute)`);
// console.log(`Monitoring: ${CONFIG.INPUT_BUCKET}/${CONFIG.INPUT_PREFIX}`);
// console.log(`Press Ctrl+C to exit\n`);

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("\n\n🛑 Shutting down gracefully...");
//   await mongoose.disconnect();
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("\n\n🛑 Shutting down gracefully...");
//   await mongoose.disconnect();
//   process.exit(0);
// });