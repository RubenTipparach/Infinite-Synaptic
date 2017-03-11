//'use strict'; <-- prevents unsafe action, but also breaks my code lols!
let app = require('express')();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let fs = require('fs');
let clientServer = require('socket.io-client');
let colors = require('colors');
let synLogger = require('./logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

// for loading arguments.
process.argv.forEach((val, index, array) => {
    let text = index + ': ' + val;
    synLogger.info(text.magenta);
    try {
        if (val == "xor") {
            let xor = require('./neurons/basic-xor.js');
            xor();
        }

        if (val == "sandbox") {
            let sandbox = require('./neurons/sandbox-neuron.js');
            sandbox();
        }

        if (val == "iris") {
            let iris = require('./neurons/iris-classifier.js');
            iris();
        }
    }
    catch (e)
    {
        synLogger.error(e);
    }
});

server.listen(3000);
