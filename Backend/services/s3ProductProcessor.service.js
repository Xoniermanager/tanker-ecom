

const path = require("path");
const productService = require("./product.service"); 
const { S3_BUCKETS } = require("../config/s3.config");
const { listCSVFiles, getFileContent, moveFile, uploadFile, deleteFile } = require("../utils/s3.utils");
const { parseCSV, buildCSV } = require("../utils/csv.utils");



function buildDestKey(sourceKey) {
  const basename = path.basename(sourceKey);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}_${basename}`;
}

function buildAnnotatedCSV(headers, rows, errors) {
  
  const errorMap = new Map();
  for (const e of errors) {
    const dataIndex = e.row - 2; 
    errorMap.set(dataIndex, e.error);
  }

  const annotatedHeaders = [...headers, "Error"];
  const annotatedRows = rows.map((row, idx) => [
    ...row,
    errorMap.get(idx) ?? "",
  ]);

  return buildCSV(annotatedHeaders, annotatedRows);
}


async function processFreshFile(key) {
  console.log(`[S3Processor] Processing: ${key}`);

  let csvText;
  try {
    csvText = await getFileContent(S3_BUCKETS.FRESH, key);
  } catch (err) {
    console.error(`[S3Processor] Failed to download ${key}:`, err.message);
    throw err;
  }

 
  let headers, rows;
  try {
    ({ headers, rows } = parseCSV(csvText));
  } catch (parseErr) {
    
    console.error(`[S3Processor] CSV parse error for ${key}:`, parseErr.message);

    const failedCSV = `Error\n"${parseErr.message.replace(/"/g, '""')}"`;
    const destKey = buildDestKey(key);

    await uploadFile(S3_BUCKETS.FAILED, destKey, failedCSV);
    await deleteFile(S3_BUCKETS.FRESH, key);

    return { key, status: "failed", successful: 0, failed: 1 };
  }


  let results;
  try {
    results = await productService.createBulkProducts(headers, rows);
  } catch (serviceErr) {
    
    console.error(`[S3Processor] Service error for ${key}:`, serviceErr.message);

    const annotated = buildAnnotatedCSV(headers, rows, [
      { row: 2, error: `Fatal: ${serviceErr.message}` },
    ]);
    const destKey = buildDestKey(key);

    await uploadFile(S3_BUCKETS.FAILED, destKey, annotated);
    await deleteFile(S3_BUCKETS.FRESH, key);

    return { key, status: "failed", successful: 0, failed: rows.length };
  }

  const destKey = buildDestKey(key);


  if (results.failed === 0) {
  
    await uploadFile(S3_BUCKETS.COMPLETE, destKey, csvText);
    await deleteFile(S3_BUCKETS.FRESH, key);

    console.log(
      `[S3Processor] ${key} -> COMPLETE (${results.successful} products)`
    );
    return { key, status: "complete", successful: results.successful, failed: 0 };

  } else {
    
    const annotated = buildAnnotatedCSV(headers, rows, results.errors);
    await uploadFile(S3_BUCKETS.FAILED, destKey, annotated);
    await deleteFile(S3_BUCKETS.FRESH, key);

    console.log(
      `[S3Processor]  ${key} -> FAILED ` +
      `(${results.successful} ok, ${results.failed} failed)`
    );
    return {
      key,
      status: "failed",
      successful: results.successful,
      failed: results.failed,
      errors: results.errors,
    };
  }
}


async function processAllFreshFiles() {
  console.log("[S3Processor] Polling fresh bucket:", S3_BUCKETS.FRESH);

  const files = await listCSVFiles(S3_BUCKETS.FRESH);

  if (files.length === 0) {
    console.log("[S3Processor] No CSV files found in fresh bucket.");
    return { filesProcessed: 0, totalSuccessful: 0, totalFailed: 0, results: [] };
  }

  console.log(`[S3Processor] Found ${files.length} file(s) to process.`);

  const results = [];
  let totalSuccessful = 0;
  let totalFailed = 0;

  for (const file of files) {
    try {
      const result = await processFreshFile(file.Key);
      results.push(result);
      totalSuccessful += result.successful;
      totalFailed += result.failed;
    } catch (err) {
     
      console.error(`[S3Processor] Unhandled error for ${file.Key}:`, err.message);
      results.push({ key: file.Key, status: "error", error: err.message });
    }
  }

  console.log(
    `[S3Processor] Done. Files: ${files.length}, ` +
    `Products OK: ${totalSuccessful}, Products failed: ${totalFailed}`
  );

  return { filesProcessed: files.length, totalSuccessful, totalFailed, results };
}

module.exports = { processAllFreshFiles, processFreshFile };