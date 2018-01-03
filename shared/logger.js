'use strict';

const winston = require('winston');
const config = require('../configuration');

const appEnv = config.get('NODE_ENV') || 'development';

const loggers = {
    development: new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
            })
        ]
    }),
    production: new winston.Logger({
        transports: [
            new winston.transports.File({
                name: 'error-file',
                filename: 'file-error.log',
                level: 'error'
            })
        ]
    })
};

module.exports = loggers[appEnv];
