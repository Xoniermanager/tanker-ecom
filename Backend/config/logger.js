const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'tanker-ecom' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Console output in non-production
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Utility to create custom loggers with dedicated transport
logger.createScopedLogger = (scopeName, filePath) => {
    const scopedLogger = logger.child({ scope: scopeName });

    scopedLogger.add(new winston.transports.File({
        filename: path.resolve('logs', filePath),
        level: 'silly',
    }));

    return scopedLogger;
};

module.exports = logger;