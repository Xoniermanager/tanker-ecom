const { Queue } = require("bullmq");
const { connection } = require("./redis");

const taskQueue = new Queue("taskQueue", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: 5000
    }
});

module.exports = taskQueue;