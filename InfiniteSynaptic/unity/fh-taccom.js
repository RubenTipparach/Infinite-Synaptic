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

        this.currentIdCounter = 0;

        synLogger.debug('FH-TACCOM Initializing...');
    }

    /**
     * 
     * @param {any} socket
     */
    initializeEvents(socket)
    {
        socket.to('unityServer').emit("intialize", {
            data: "test package from server cutom unityServer room"
            //normally add data here.
        });

        var myClass = this;

        socket.on('spawn-ship', (shipRequest) => {
            shipRequest.shipId = myClass.currentIdCounter;
            
            myClass.spawnShip(shipRequest, socket);

            myClass.currentIdCounter++;
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
        try
        {
            this.ships.push(shipRequest);
            synLogger.debug("ship message: " + JSON.stringify(shipRequest));
            socket.emit('spawn-ship', shipRequest);// kewl
            socket.broadcast.emit('spawn-ship', shipRequest);// kewl
        }
        catch (e)
        {
            synLogger.error("ship message: " + JSON.stringify(shipRequest));
        }
    }
}