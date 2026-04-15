

const S3_BUCKETS = {
  FRESH: process.env.S3_FRESH_BUCKET || "website-fresh-products",
  COMPLETE: process.env.S3_COMPLETE_BUCKET || "website-complete-products",
  FAILED: process.env.S3_FAILED_BUCKET || "website-failed-products",
};




const CRON_EXPRESSION = process.env.CRON_EXPRESSION || "*/5 * * * *";

module.exports = { S3_BUCKETS, CRON_EXPRESSION };