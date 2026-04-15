
const cron = require("node-cron");
const { CRON_EXPRESSION } = require("../config/s3.config");
const { processAllFreshFiles } = require("../services/s3ProductProcessor.service");


let isRunning = false;


async function runJob() {
  if (isRunning) {
    console.log("[S3CronJob] Previous run still in progress — skipping this tick.");
    return;
  }

  isRunning = true;
  const start = Date.now();

  try {
    const summary = await processAllFreshFiles();

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(
      `[S3CronJob] Completed in ${elapsed}s — ` +
      `files: ${summary.filesProcessed}, ` +
      `products ok: ${summary.totalSuccessful}, ` +
      `products failed: ${summary.totalFailed}`
    );
  } catch (err) {
    console.error("[S3CronJob] Unexpected error:", err);
  } finally {
    isRunning = false;
  }
}


function startS3ProcessorCron(options = {}) {
  const expression = options.expression || CRON_EXPRESSION;
  const runOnStart = options.runOnStart ?? false;

  if (!cron.validate(expression)) {
    throw new Error(`[S3CronJob] Invalid cron expression: "${expression}"`);
  }

  console.log(`[S3CronJob] Starting — schedule: "${expression}"`);

  const task = cron.schedule(expression, runJob, {
    scheduled: true,
    timezone: process.env.TZ || "UTC",
  });

  if (runOnStart) {
    console.log("[S3CronJob] Running immediately on startup...");
    runJob(); 
  }

  return task;
}

module.exports = { startS3ProcessorCron };