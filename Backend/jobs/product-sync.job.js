const AWS = require("aws-sdk");
const csv = require("csv-parser");
const fs = require("fs").promises;
const fsSync = require("fs");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");
const { BUCKET_NAME } = require("../constants/enums");


AWS.config.update({ region: "ap-southeast-2" });

const s3 = new AWS.S3();
const mongoUrl = process.env.MONGO_URL;


const CONFIG = {
  INPUT_BUCKET: BUCKET_NAME.INPUT,
  COMPLETE_BUCKET: BUCKET_NAME.COMPLETE,
  FAILED_BUCKET: BUCKET_NAME.FAILED,
  INPUT_PREFIX: "input/",
  COMPLETE_PREFIX: "completed/",
  FAILED_PREFIX: "failed/",
  TMP_DIR: "/tmp",
  CRON_SCHEDULE: "0 * * * *", 
};


class DatabaseManager {
  constructor(url) {
    this.url = url;
    this.client = null;
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.url, {
        useUnifiedTopology: true,
        maxPoolSize: 10,
      });
      await this.client.connect();
      console.log("Connected to MongoDB");
    }
    return this.client;
  }

  async getCollection(dbName, collectionName) {
    const client = await this.connect();
    return client.db(dbName).collection(collectionName);
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log("MongoDB connection closed");
    }
  }
}


class S3Manager {
  
  static async downloadFile(bucket, key) {
    try {
      const params = { Bucket: bucket, Key: key };
      const data = await s3.getObject(params).promise();
      
      const filename = key.split("/").pop();
      const localPath = `${CONFIG.TMP_DIR}/${filename}`;
      
      await fs.writeFile(localPath, data.Body);
      console.log(`Downloaded: ${key} to ${localPath}`);
      
      return localPath;
    } catch (error) {
      console.error(`Failed to download ${key}:`, error.message);
      throw error;
    }
  }

  
  static async moveFile(sourceKey, destinationBucket, destinationPrefix) {
    try {
      const filename = sourceKey.split("/").pop();
      const destinationKey = `${destinationPrefix}${filename}`;

      
      await s3
        .copyObject({
          Bucket: destinationBucket,
          CopySource: `${CONFIG.INPUT_BUCKET}/${sourceKey}`,
          Key: destinationKey,
        })
        .promise();

      console.log(`Copied to: ${destinationBucket}/${destinationKey}`);

      
      await s3
        .deleteObject({
          Bucket: CONFIG.INPUT_BUCKET,
          Key: sourceKey,
        })
        .promise();

      console.log(`Deleted from source: ${sourceKey}`);
    } catch (error) {
      console.error(`Failed to move file ${sourceKey}:`, error.message);
      throw error;
    }
  }

  
  static async listInputFiles() {
    try {
      const data = await s3
        .listObjectsV2({
          Bucket: CONFIG.INPUT_BUCKET,
          Prefix: CONFIG.INPUT_PREFIX,
        })
        .promise();

      const csvFiles = (data.Contents || [])
        .filter((item) => item.Key.endsWith(".csv") && item.Size > 0)
        .map((item) => item.Key);

      return csvFiles;
    } catch (error) {
      console.error("Failed to list input files:", error.message);
      throw error;
    }
  }
}


class CSVProcessor {
 
  static async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const products = [];
      const errors = [];

      fsSync
        .createReadStream(filePath)
        .pipe(csv({ skipEmptyLines: true, trim: true }))
        .on("data", (row) => {
          try {
            // Validate row has required fields
            if (this.validateProduct(row)) {
              products.push(this.sanitizeProduct(row));
            } else {
              errors.push({ row, reason: "Missing required fields" });
            }
          } catch (error) {
            errors.push({ row, error: error.message });
          }
        })
        .on("end", () => {
          if (errors.length > 0) {
            console.warn(`CSV parsing warnings (${errors.length} rows):`, errors.slice(0, 5));
          }
          console.log(`Parsed ${products.length} valid products from CSV`);
          resolve(products);
        })
        .on("error", (error) => {
          console.error("CSV parsing error:", error);
          reject(error);
        });
    });
  }

  
  static validateProduct(product) {
    return product && Object.keys(product).length > 0;
  }

  
  static sanitizeProduct(product) {
    // Add sanitization logic (trim whitespace, format dates, etc.)
    const sanitized = {};
    for (const [key, value] of Object.entries(product)) {
      sanitized[key.trim()] = typeof value === "string" ? value.trim() : value;
    }
    return sanitized;
  }
}

// Main Job Logic
class ProductImportJob {
  constructor() {
    this.dbManager = new DatabaseManager(mongoUrl);
    this.stats = {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
    };
  }

  async processFile(fileKey) {
    let localFilePath = null;

    try {
      console.log(`\n=== Processing: ${fileKey} ===`);

      // Download file from S3
      localFilePath = await S3Manager.downloadFile(CONFIG.INPUT_BUCKET, fileKey);

      const products = await CSVProcessor.processCSV(localFilePath);

      if (products.length === 0) {
        console.warn(`No valid products found in ${fileKey}`);
        await S3Manager.moveFile(
          fileKey,
          CONFIG.FAILED_BUCKET,
          CONFIG.FAILED_PREFIX
        );
        this.stats.failed++;
        return;
      }

      // Insert into MongoDB
      const collection = await this.dbManager.getCollection(process.env.DB_NAME , "products");
      const result = await collection.insertMany(products, { ordered: false });
      
      console.log(`Inserted ${result.insertedCount} products into MongoDB`);

      // Move to completed bucket
      await S3Manager.moveFile(
        fileKey,
        CONFIG.COMPLETE_BUCKET,
        CONFIG.COMPLETE_PREFIX
      );

      console.log(`✓ Successfully processed: ${fileKey}`);
      this.stats.successful++;
    } catch (error) {
      console.error(`✗ Failed to process ${fileKey}:`, error.message);

      // Move to failed bucket
      try {
        await S3Manager.moveFile(
          fileKey,
          CONFIG.FAILED_BUCKET,
          CONFIG.FAILED_PREFIX
        );
      } catch (moveError) {
        console.error(`Failed to move file to failed bucket:`, moveError.message);
      }

      this.stats.failed++;
    } finally {
      // Cleanup local file
      if (localFilePath) {
        try {
          await fs.unlink(localFilePath);
          console.log(`Cleaned up: ${localFilePath}`);
        } catch (unlinkError) {
          console.error(`Failed to cleanup ${localFilePath}:`, unlinkError.message);
        }
      }
    }
  }

  
  async run() {
    const startTime = Date.now();
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Job started at: ${new Date().toISOString()}`);
    console.log(`${"=".repeat(60)}`);

    this.stats = { totalProcessed: 0, successful: 0, failed: 0 };

    try {
      
      const files = await S3Manager.listInputFiles();

      if (files.length === 0) {
        console.log("No new CSV files found in input bucket");
        return;
      }

      console.log(`Found ${files.length} CSV file(s) to process`);
      this.stats.totalProcessed = files.length;

      
      for (const fileKey of files) {
        await this.processFile(fileKey);
      }
    } catch (error) {
      console.error("Job execution error:", error);
    } finally {
      await this.dbManager.close();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Job completed in ${duration}s`);
      console.log(`Total files: ${this.stats.totalProcessed}`);
      console.log(`Successful: ${this.stats.successful}`);
      console.log(`Failed: ${this.stats.failed}`);
      console.log(`${"=".repeat(60)}\n`);
    }
  }
}


const job = new ProductImportJob();


cron.schedule(CONFIG.CRON_SCHEDULE, async () => {
  await job.run();
});



console.log(`Product import scheduler started`);
console.log(`Schedule: ${CONFIG.CRON_SCHEDULE} (Every hour)`);
console.log(`Monitoring bucket: ${CONFIG.INPUT_BUCKET}/${CONFIG.INPUT_PREFIX}`);
console.log(`Press Ctrl+C to exit\n`);


process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await job.dbManager.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await job.dbManager.close();
  process.exit(0);
});