const { Worker } = require("bullmq");
const { connection } = require("./redis");

const taskHandlerMap = {
    sendOtpEmail: async ({ to, otp, template }) => {
        const { sendOtpEmail } = require("../utils/otp");
        return await sendOtpEmail(to, otp, template);
    },
    logEvent: async ({ message }) => {
        console.log("Logging event:", message);
    },
};

const worker = new Worker("taskQueue", async (job) => {
    const handler = taskHandlerMap[job.name];
    if (!handler) throw new Error(`No handler defined for job: ${job.name}`);
    return await handler(job.data);
}, { connection });

worker.on("failed", (job, err) => {
    console.error(`Job ${job.name} failed:`, err.message);
});
