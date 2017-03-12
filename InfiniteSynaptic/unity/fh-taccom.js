let clientServer = require('socket.io-client');

let colors = require('colors');
let synLogger = require('../logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

module.exports = class FHTaccom
{
    constructor(connections)
    {
        this.connections = connections;
        this.ships = [];

        synLogger.debug('FH-TACCOM Initializing...');
    }

    registerClient()
    {

    }

    registerUser()
    {

    }

    spawnShip(shipRequest)
    {

    }
}