//'use strict'; <-- prevents unsafe action, but also breaks my code lols!
let app = require('express')();
let server = require('http').Server(app);
var io = require('socket.io')(server);
let colors = require('colors');
let synLogger = require('./logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

// for loading arguments.
process.argv.forEach((val, index, array) => {

    synLogger.info(' ' + index.toString().blue.bold.bgWhite + ': ' + val.yellow);

    try {

        // usage: -xor -sandbox -iris
        if (val == "-xor") {
            let xor = require('./neurons/basic-xor.js');
            xor();
        }

        if (val == "-sandbox") {
            let sandbox = require('./neurons/sandbox-neuron.js');
            sandbox();
        }

        if (val == "-iris") {
            let iris = require('./neurons/iris-classifier.js');
            iris();
        }

        // usage: -unity
        if (val == "-unityserver")
        {

        }
    }
    catch (e)
    {
        synLogger.error(e);
    }
});

server.listen(3000);

//Socket for the unity server.
try {
    let unityServer = require('./unity/unity-server.js');
    unityServer(io);
}
catch (e) {
    synLogger.error(e);
}