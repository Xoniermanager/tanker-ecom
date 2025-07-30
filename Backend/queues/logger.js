const { createLogger, format, transports } = require('winston');
const path = require('path');

const queueLogger = createLogger({
    level: 'silly',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'queue-manager' },
    transports: [
        new transports.File({ filename: path.resolve('logs/queue.log') })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    queueLogger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = queueLogger;
