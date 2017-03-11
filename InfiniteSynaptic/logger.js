let winston = require('winston');
let colors = require('colors');

// configure colors.
let customTheme = {
    levels: {
        silly: 0, input: 1, verbose: 2,
        prompt: 3, info: 4, data: 5,
        help: 6, warn: 7, debug: 8,
        error: 9
    },
    colors: {
        silly: 'rainbow', input: 'grey', verbose: 'cyan',
        prompt: 'grey', info: 'green', data: 'grey',
        help: 'cyan', warn: 'yellow', debug: 'cyan',
        error: 'red'
    }
};

colors.setTheme(customTheme.colors);

// configure logger.
let synLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: true }),
        new winston.transports.File({ filename: './logs/all-logs.json' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exceptions.json' })
    ],
    levels: customTheme.levels
});

winston.addColors(customTheme.colors);

/*
 * summary: The logging module, thanks Tyler L.
 */
module.exports = synLogger;