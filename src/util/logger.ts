import * as fs                          from 'fs';
const { createLogger, format, transports } = require('winston');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'admin.log');

export const adminLogger = createLogger({
// change level if in dev environment versus production
level: env === 'development' ? 'debug' : 'info',
format: format.combine(
    format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
),
transports: [
    new transports.Console({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
        )
    )
    }),
    new transports.File({ filename })
]
});