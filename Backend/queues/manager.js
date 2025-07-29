const TaskQueue = require('./index');
const QueueWorker = require('./worker');
const queueLogger = require('./logger');

class QueueManager {
    constructor() {
        this.queues = new Map();
        this.workers = new Map();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            this.createQueue('general'); // Initialize default general queue

            // Initialize workers (only if this instance should process jobs)
            if (process.env.ENABLE_WORKERS !== 'false') {
                this.createWorker('general');
            }

            this.isInitialized = true;
            queueLogger.info('Queue manager initialized successfully');
        } catch (error) {
            queueLogger.error('Failed to initialize queue manager:', error);
            throw error;
        }
    }

    createQueue(queueName) {
        if (this.queues.has(queueName)) {
            queueLogger.warn(`Queue ${queueName} already exists`);
            return this.queues.get(queueName);
        }

        const queue = new TaskQueue(queueName);
        this.queues.set(queueName, queue);
        queueLogger.info(`Created queue: ${queueName}`);
        return queue;
    }

    createWorker(queueName, concurrency = null) {
        if (this.workers.has(queueName)) {
            queueLogger.warn(`Worker for queue ${queueName} already exists`);
            return this.workers.get(queueName);
        }

        const worker = new QueueWorker(queueName, concurrency);
        this.workers.set(queueName, worker);
        queueLogger.info(`Created worker for queue: ${queueName}`);
        return worker;
    }

    getQueue(queueName = 'general') {
        if (!this.isInitialized) {
            throw new Error('Queue manager not initialized');
        }

        // Create queue if it doesn't exist
        if (!this.queues.has(queueName)) {
            return this.createQueue(queueName);
        }

        return this.queues.get(queueName);
    }

    getWorker(queueName) {
        return this.workers.get(queueName);
    }

    async getAllQueueStatuses() {
        const statuses = {};

        for (const [name, queue] of this.queues) {
            statuses[name] = await queue.getQueueStatus();
        }

        return statuses;
    }

    async addJobProcessor(queueName, jobType, processor) {
        const worker = this.getWorker(queueName);
        if (worker) {
            worker.addJobProcessor(jobType, processor);
        } else {
            queueLogger.warn(`No worker found for queue ${queueName}`);
        }
    }

    getAvailableQueues() {
        return Array.from(this.queues.keys());
    }

    async shutdown() {
        queueLogger.info('Shutting down queue manager...');

        // Close all workers first
        for (const [name, worker] of this.workers) {
            try {
                await worker.closeWorker();
                queueLogger.info(`Worker ${name} closed`);
            } catch (error) {
                queueLogger.error(`Error closing worker ${name}:`, error);
            }
        }

        // Close all queues
        for (const [name, queue] of this.queues) {
            try {
                await queue.closeQueue();
                queueLogger.info(`Queue ${name} closed`);
            } catch (error) {
                queueLogger.error(`Error closing queue ${name}:`, error);
            }
        }

        this.queues.clear();
        this.workers.clear();
        this.isInitialized = false;
        queueLogger.info('Queue manager shutdown complete');
    }
}

// Singleton instance
const queueManager = new QueueManager();

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    queueLogger.info('SIGTERM received, shutting down gracefully...');
    await queueManager.shutdown();
    process.exit(0);
});

process.on('SIGINT', async () => {
    queueLogger.info('SIGINT received, shutting down gracefully...');
    await queueManager.shutdown();
    process.exit(0);
});

module.exports = queueManager;