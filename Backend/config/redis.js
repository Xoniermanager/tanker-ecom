const Redis = require('ioredis');
require('dotenv').config();

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,

    connectTimeout: 10000,
    maxRetriesPerRequest: null,
    retryDelayOnFailover: 100,

    enableReadyCheck: false,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4,

    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        return err.message.includes(targetError);
    },
};

const createRedisConnection = () => {
    const redis = new Redis(redisConfig);

    redis.on('connect', () => {
        console.log('Redis connected successfully');
    });

    redis.on('error', (err) => {
        console.error('Redis connection error:', err);
    });

    redis.on('ready', () => {
        console.log('Redis ready for operations');
    });

    return redis;
};

module.exports = {
    redisConfig,
    createRedisConnection
};




// ------------------------------------
// // redis.js
// const Redis = require('ioredis');
// require('dotenv').config();

// const redisUrl = process.env.REDIS_URL;

// if (!redisUrl) {
//     throw new Error("❌ REDIS_URL is not set in environment variables.");
// }

// const redis = new Redis(redisUrl, {
//     connectTimeout: 10000,
//     maxRetriesPerRequest: null,
//     retryDelayOnFailover: 100,

//     enableReadyCheck: false,
//     lazyConnect: true,
//     keepAlive: 30000,
//     family: 4,

//     reconnectOnError: (err) => {
//         const targetError = 'READONLY';
//         return err.message.includes(targetError);
//     },
// });

// // Logging events
// redis.on('connect', () => {
//     console.log('✅ Redis connected successfully');
// });

// redis.on('ready', () => {
//     console.log('🚀 Redis ready for operations');
// });

// redis.on('error', (err) => {
//     console.error('❌ Redis connection error:', err);
// });

// module.exports = redis;
