import * as fs from 'fs';
const winston = require('winston');
const { format } = winston;
const path = require('path'); 
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Maybe add this to app.ts
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const adminLogFilename = path.join(logDir, 'admin.log'); 
const appLogFilename = path.join(logDir, 'application.log');
const campaignLogFilename = path.join(logDir, 'campaign.log');
const canvassLogFilename = path.join(logDir, 'canvass.log');
const managerLogFilename = path.join(logDir, 'manager.log');
const authLogFilename = path.join(logDir, 'authentication.log');

export const getLogger = loggerName => winston.loggers.get(loggerName);


winston.loggers.add('adminLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: adminLogFilename })
    ]
});


winston.loggers.add('authLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: authLogFilename })
    ]
});


winston.loggers.add('appLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: appLogFilename })
    ]
});


winston.loggers.add('campaignLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: campaignLogFilename })
    ]
});


winston.loggers.add('canvasserLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: canvassLogFilename })
    ]
});


winston.loggers.add('managerLogger', {
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new winston.transports.File({ filename: managerLogFilename })
    ]
});