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
        new winston.transports.File({ filename: 'auth.log' })
    ]
});


// winston.loggers.add('campaignLogger', {
//     // change level if in dev environment versus production
//     level: env === 'development' ? 'debug' : 'info',
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             format: format.combine(
//                 format.colorize(),
//                 format.printf(
//                 info => `${info.timestamp} ${info.level}: ${info.message}`
//                 )
//             )
//         }),
//         new winston.transports.File({ filename: 'campaign.log' })
//     ]
// });


// winston.loggers.add('canvasserLogger', {
//     // change level if in dev environment versus production
//     level: env === 'development' ? 'debug' : 'info',
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             format: format.combine(
//                 format.colorize(),
//                 format.printf(
//                 info => `${info.timestamp} ${info.level}: ${info.message}`
//                 )
//             )
//         }),
//         new winston.transports.File({ filename: 'canvasser.log' })
//     ]
// });


// winston.loggers.add('managerLogger', {
//     // change level if in dev environment versus production
//     level: env === 'development' ? 'debug' : 'info',
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             format: format.combine(
//                 format.colorize(),
//                 format.printf(
//                 info => `${info.timestamp} ${info.level}: ${info.message}`
//                 )
//             )
//         }),
//         new winston.transports.File({ filename: 'manager.log' })
//     ]
// });


// winston.loggers.add('appLogger', {
//     // change level if in dev environment versus production
//     level: env === 'development' ? 'debug' : 'info',
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new winston.transports.Console({
//             level: 'info',
//             format: format.combine(
//                 format.colorize(),
//                 format.printf(
//                 info => `${info.timestamp} ${info.level}: ${info.message}`
//                 )
//             )
//         }),
//         new winston.transports.File({ filename: appLogFilename })
//     ]
// });