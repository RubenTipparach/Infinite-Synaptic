//'use strict'; <-- prevents unsafe action, but also breaks my code lols!
let app = require('express')();
let server = require('http').Server(app);
//let server = require('http').createServer();
var io = require('socket.io')(server);
let colors = require('colors');
let synLogger = require('./logger.js');
let strformat = require('strformat');

//io.set('heartbeat timeout', 4000);
//io.set('heartbeat interval', 2000);

var fs = require("fs");
var serverConfig = JSON.parse(fs.readFileSync("server-config.json"));

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
    }
    catch (e)
    {
        synLogger.error(e);
    }
});


//Socket for the unity server.
try {
    let unityServer = require('./unity/unity-server.js');
    unityServer(io, serverConfig.gameType);
}
catch (e) {
    synLogger.error(e);
}

server.listen(3000);
