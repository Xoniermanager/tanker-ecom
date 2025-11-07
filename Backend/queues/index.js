const { Queue, QueueEvents } = require('bullmq');
const { redisConfig } = require('../config/redis');
const queueLogger = require('./logger');

class TaskQueue {
    constructor(queueName = 'general') {
        this.queueName = queueName;

        this.queue = new Queue(queueName, {
            connection: redisConfig,
            defaultJobOptions: {
                removeOnComplete: 100, 
                removeOnFail: 50, 
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                delay: 0,
            },
        });

        
        this.queueEvents = new QueueEvents(queueName, { connection: redisConfig });
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.queueEvents.on('completed', ({ jobId }) => {
            queueLogger.info(`Job ${jobId} in queue ${this.queueName} completed successfully`);
        });

        this.queueEvents.on('failed', ({ jobId, failedReason }) => {
            queueLogger.error(`Job ${jobId} in queue ${this.queueName} failed: ${failedReason}`);
        });

        this.queueEvents.on('stalled', ({ jobId }) => {
            queueLogger.warn(`Job ${jobId} in queue ${this.queueName} stalled`);
        });

        this.queueEvents.on('progress', ({ jobId, data }) => {
            queueLogger.info(`Job ${jobId} in queue ${this.queueName} progress: ${data}%`);
        });
    }

    async addJob(jobType, jobData, options = {}) {
        try {
            const job = await this.queue.add(jobType, jobData, {
                priority: options.priority || 0,
                delay: options.delay || 0,
                attempts: options.attempts || 3,
                removeOnComplete: options.removeOnComplete || 100,
                removeOnFail: options.removeOnFail || 50,
                ...options
            });

            queueLogger.info(`Job ${jobType} added with ID: ${job.id} to queue ${this.queueName}`);
            return job;
        } catch (error) {
            queueLogger.error(`Error adding job ${jobType} to queue ${this.queueName}:`, error);
            throw error;
        }
    }

    async addBulkJobs(jobs) {
        try {
            const formattedJobs = jobs.map(job => ({
                name: job.type,
                data: job.data,
                opts: job.options || {}
            }));

            const addedJobs = await this.queue.addBulk(formattedJobs);
            queueLogger.info(`Added ${addedJobs.length} bulk jobs to queue ${this.queueName}`);
            return addedJobs;
        } catch (error) {
            queueLogger.error(`Error adding bulk jobs to queue ${this.queueName}:`, error);
            throw error;
        }
    }

    async addScheduledJob(jobType, jobData, scheduleTime, options = {}) {
        try {
            const delay = new Date(scheduleTime).getTime() - Date.now();
            if (delay < 0) {
                throw new Error('Schedule time must be in the future');
            }

            const job = await this.addJob(jobType, jobData, { ...options, delay });
            queueLogger.info(`Scheduled job ${jobType} with ID: ${job.id} for ${scheduleTime}`);
            return job;
        } catch (error) {
            queueLogger.error(`Error scheduling job ${jobType}:`, error);
            throw error;
        }
    }

    async addRecurringJob(jobType, jobData, cronExpression, options = {}) {
        try {
            const job = await this.queue.add(jobType, jobData, {
                repeat: { cron: cronExpression },
                ...options
            });

            queueLogger.info(`Recurring job ${jobType} added with pattern: ${cronExpression}`);
            return job;
        } catch (error) {
            queueLogger.error(`Error adding recurring job ${jobType}:`, error);
            throw error;
        }
    }

    async getJob(jobId) {
        try {
            return await this.queue.getJob(jobId);
        } catch (error) {
            queueLogger.error(`Error getting job ${jobId}:`, error);
            throw error;
        }
    }

    async removeJob(jobId) {
        try {
            const job = await this.getJob(jobId);
            if (job) {
                await job.remove();
                queueLogger.info(`Job ${jobId} removed from queue ${this.queueName}`);
                return true;
            }
            return false;
        } catch (error) {
            queueLogger.error(`Error removing job ${jobId}:`, error);
            throw error;
        }
    }

    async retryJob(jobId) {
        try {
            const job = await this.getJob(jobId);
            if (job) {
                await job.retry();
                queueLogger.info(`Job ${jobId} retried in queue ${this.queueName}`);
                return true;
            }
            return false;
        } catch (error) {
            queueLogger.error(`Error retrying job ${jobId}:`, error);
            throw error;
        }
    }

    async getQueueStatus() {
        const waiting = await this.queue.getWaiting();
        const active = await this.queue.getActive();
        const completed = await this.queue.getCompleted();
        const failed = await this.queue.getFailed();
        const delayed = await this.queue.getDelayed();

        return {
            name: this.queueName,
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
            delayed: delayed.length,
            total: waiting.length + active.length + completed.length + failed.length + delayed.length
        };
    }

    async getJobs(status = 'waiting', start = 0, end = 10) {
        try {
            let jobs;
            switch (status) {
                case 'waiting':
                    jobs = await this.queue.getWaiting(start, end);
                    break;
                case 'active':
                    jobs = await this.queue.getActive(start, end);
                    break;
                case 'completed':
                    jobs = await this.queue.getCompleted(start, end);
                    break;
                case 'failed':
                    jobs = await this.queue.getFailed(start, end);
                    break;
                case 'delayed':
                    jobs = await this.queue.getDelayed(start, end);
                    break;
                default:
                    throw new Error(`Invalid status: ${status}`);
            }

            return jobs.map(job => ({
                id: job.id,
                name: job.name,
                data: job.data,
                progress: job.progress(),
                processedOn: job.processedOn,
                finishedOn: job.finishedOn,
                failedReason: job.failedReason,
                opts: job.opts,
            }));
        } catch (error) {
            queueLogger.error(`Error getting ${status} jobs:`, error);
            throw error;
        }
    }

    async pauseQueue() {
        await this.queue.pause();
        queueLogger.info(`Queue ${this.queueName} paused`);
    }

    async resumeQueue() {
        await this.queue.resume();
        queueLogger.info(`Queue ${this.queueName} resumed`);
    }

    async cleanQueue(grace = 0, status = 'completed') {
        try {
            const cleaned = await this.queue.clean(grace, status);
            queueLogger.info(`Cleaned ${cleaned.length} ${status} jobs from queue ${this.queueName}`);
            return cleaned;
        } catch (error) {
            queueLogger.error(`Error cleaning queue ${this.queueName}:`, error);
            throw error;
        }
    }

    async closeQueue() {
        await this.queue.close();
        await this.queueEvents.close();
        queueLogger.info(`Queue ${this.queueName} closed`);
    }
}

module.exports = TaskQueue;