const { Worker } = require('bullmq');
const { redisConfig } = require('../config/redis');
const queueLogger = require('./logger');
const logger = require('../config/logger');
const { mailTransporter } = require('../utils/email');

const jobProcessors = {
    sendEmail: async (job) => {
        const { to, subject, text, html } = job.data;

        const info = await mailTransporter.sendMail({
            from: process.env.EMAIL_FROM || '"Tanker Solution" <admin@abc.com>',
            to,
            subject,
            text: text,
            html: html,
        });

        logger.info(`Email sent to ${to}: ${subject}`);
        return { messageId: info.messageId, status: 'sent' };
    },
};

class QueueWorker {
    constructor(queueName = 'general', concurrency = null) {
        this.queueName = queueName;
        this.concurrency = concurrency || parseInt(process.env.WORKER_CONCURRENCY) || 5;

        this.worker = new Worker(queueName, this.processJob.bind(this), {
            connection: redisConfig,
            concurrency: this.concurrency,
            limiter: {
                max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
                duration: parseInt(process.env.RATE_LIMIT_DURATION) || 60000, // 1 minute
            },
            settings: {
                stalledInterval: 30000,    // 30 seconds
                maxStalledCount: 1,
            },
        });

        this.setupWorkerEvents();
        queueLogger.info(`General worker initialized for queue ${queueName} with concurrency ${this.concurrency}`);
    }

    async processJob(job) {
        const { name, data } = job;

        try {
            queueLogger.info(`Processing job ${job.id} of type ${name}`);

            const processor = jobProcessors[name];
            if (!processor) {
                throw new Error(`No processor found for job type: ${name}`);
            }

            // Process the job
            const result = await processor(job);

            queueLogger.info(`Job ${job.id} of type ${name} completed successfully`);
            return result;
        } catch (error) {
            queueLogger.error(`Job ${job.id} of type ${name} failed:`, error);
            throw error;
        }
    }

    setupWorkerEvents() {
        this.worker.on('completed', (job) => {
            queueLogger.info(`Worker completed job ${job.id} of type ${job.name}`);
        });

        this.worker.on('failed', (job, err) => {
            queueLogger.error(`Worker failed job ${job?.id} of type ${job?.name}:`, err);
        });

        this.worker.on('error', (err) => {
            queueLogger.error(`Worker error in queue ${this.queueName}:`, err);
        });

        this.worker.on('stalled', (jobId) => {
            queueLogger.warn(`Worker job ${jobId} stalled in queue ${this.queueName}`);
        });

        this.worker.on('progress', (job, progress) => {
            queueLogger.debug(`Job ${job.id} progress: ${progress}%`);
        });
    }

    addJobProcessor(jobType, processor) {
        if (typeof processor !== 'function') {
            throw new Error('Processor must be a function');
        }

        jobProcessors[jobType] = processor;
        queueLogger.info(`Added custom processor for job type: ${jobType}`);
    }

    removeJobProcessor(jobType) {
        if (jobProcessors[jobType]) {
            delete jobProcessors[jobType];
            queueLogger.info(`Removed processor for job type: ${jobType}`);
            return true;
        }
        return false;
    }

    getAvailableJobTypes() {
        return Object.keys(jobProcessors);
    }

    async closeWorker() {
        await this.worker.close();
        queueLogger.info(`Worker for queue ${this.queueName} closed`);
    }
}

module.exports = QueueWorker;