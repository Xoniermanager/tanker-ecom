const schedule = require("node-schedule");
const ScheduledTask = require("../models/scheduled-tasks.model");
const callbacks = require("./callbacks");

module.exports = {
    /**
     * Schedules a new job and persists it in the database.
     *
     * @param {string} jobId - Unique identifier for the job.
     * @param {string} refType - Type of the associated resource (e.g., "Tournament").
     * @param {string} refId - ID of the associated resource.
     * @param {Date} date - The date and time when the job should execute.
     * @param {string} callbackName - The name of the callback function to execute.
     * @param {Object} data - Additional data to pass to the callback.
     */
    scheduleJob: async (jobId, refType, refId, date, callbackName, data = {}) => {
        // Cancel any existing job with the same ID
        if (schedule.scheduledJobs[jobId]) {
            schedule.scheduledJobs[jobId].cancel();
        }

        // Schedule the job in memory
        schedule.scheduleJob(jobId, date, async () => {
            const callback = callbacks[callbackName];
            if (callback) {
                await callback(data);
                await ScheduledTask.deleteOne({ jobId });
            } else {
                console.error(`Callback function "${callbackName}" not found.`);
            }
        });

        // Persist the job in the database
        await ScheduledTask.findOneAndUpdate(
            { jobId },
            { jobId, refType, refId, date, callbackName, data },
            { upsert: true }
        );

        console.log(`Scheduled job "${jobId}" for ${date}`);
    },

    /**
     * Cancels a job and removes it from the database.
     *
     * @param {string} jobId - Unique identifier for the job.
     */
    cancelJob: async (jobId) => {
        const job = schedule.scheduledJobs[jobId];
        if (job) {
            job.cancel();
        }

        await ScheduledTask.deleteOne({ jobId });
        console.log(`Canceled and removed job "${jobId}"`);
    },

    /**
     * Reloads all jobs from the database and schedules them in memory.
     */
    reloadScheduledJobs: async () => {
        const tasks = await ScheduledTask.find();

        tasks.forEach((task) => {
            if (new Date(task.date) > new Date()) {
                schedule.scheduleJob(task.jobId, task.date, async () => {
                    const callback = callbacks[task.callbackName];
                    if (callback) {
                        await callback(task.data);
                        await ScheduledTask.deleteOne({ jobId });
                    } else {
                        console.error(`Callback function "${task.callbackName}" not found.`);
                    }
                });

                console.log(`(${new Date()}) - Reloaded job "${task.jobId}" scheduled for ${task.date}`);
            }
        });
    },

    /**
     * Retrieves a scheduled job by its unique identifier.
     *
     * @param {string} id - Unique identifier for the job.
     * @returns {Object|null} The scheduled job object or null if not found.
     */
    getJob: (id) => {
        return schedule.scheduledJobs[id] || null;
    },

    /**
     * Retrieves all currently scheduled jobs.
     *
     * @returns {Object} An object containing all scheduled jobs.
     */
    getAllJobs: () => {
        return schedule.scheduledJobs;
    },
};
