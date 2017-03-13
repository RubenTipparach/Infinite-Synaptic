let clientServer = require('socket.io-client');

let colors = require('colors');
let synLogger = require('../logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

/*
 * summary:
 *  This class module handles the Fleet Hackers: TACCOM game.
 *  The game works by allowing players to visualize and interact with
 *  gameplay throught their browser. Some cool tech eh?
 */
module.exports = class FHTaccom
{
    /*
     * summary:
     *  runs the training set.
     * parameters:
     *  socket - the socket that will trigger events on the server/clients.
     *  io - if we ever need to do wide broadcasts.
     */
    constructor(connections, socket)
    {
        this.connections = connections;
        this.ships = [];

        synLogger.debug('FH-TACCOM Initializing...');

    }

    initializeEvents(socket)
    {
        socket.to('unityServer').emit("intialize", {
            data: "test package from server cutom unityServer room"
            //normally add data here.
        });

        socket.on('spawn-ship', (shipRequest) => {
            this.spawnShip(shipRequest, socket);
        });
    }

    initializeServerSocket(socket)
    {
        this.socket = socket;
    }

    registerWebClient(socket)
    {

    }

    registerWebUser(socket)
    {

    }

    spawnShip(shipRequest, socket)
    {
        this.ships.push(shipRequest);
        synLogger.debug("ship message: " + JSON.stringify(shipRequest));
        socket.broadcast.emit('spawn-ship', shipRequest);
    }
}