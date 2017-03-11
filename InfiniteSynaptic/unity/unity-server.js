let app = require('express')();
let fs = require('fs');
let clientServer = require('socket.io-client');

let colors = require('colors');
let synLogger = require('../logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

module.exports = (io) => {

    synLogger.info("Server has started.");

    // socket initialization code for server <-> server.
    io.on('connection', (socket) => {

        synLogger.info("A client has connected...".yellow.bold);

        // sends a message to the client.
        socket.emit("hello", () => {

        });
    });
};
