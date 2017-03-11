let app = require('express')();
let io = require('socket.io')(server);
let fs = require('fs');
let clientServer = require('socket.io-client');

let colors = require('colors');
let synLogger = require('./logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

module.exports = () => {

};