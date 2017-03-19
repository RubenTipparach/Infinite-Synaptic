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
            data: "test package from server custom unityServer room"
            //normally add data here.
        });

        var myClass = this;

        //comes from the web client
        socket.on('spawn-ship', (shipRequest) => {
            shipRequest.shipId = myClass.currentIdCounter;
            
            myClass.spawnShip(shipRequest, socket);

            myClass.currentIdCounter++;
        });

        // comes from unity server
        socket.on('move-ship', (shipPosition) => {
            try {
                synLogger.debug("move-ship: " + JSON.stringify(shipPosition));
                socket.broadcast.emit('move-ship', shipPosition);
                //socket.emit('move-ship', shipRequest);

            }
            catch (e) {
                synLogger.error("ship message: " + JSON.stringify(shipRequest));
            }
        });
    }

    initializeServerSocket(socket)
    {
        this.socket = socket;
    }

    registerWebClient(socket)
    {
        synLogger.debug(" registered web client ");
        //socket.emit('move-ship', (shipPosition) => {
        //    socket.broadcast.emit('move-ship', shipPosition);
        //});
    }

    registerWebUser(socket)
    {

    }

    moveShip(shipPosition, socket)
    {
        try {
            this.ships.push(shipRequest);
            synLogger.debug("ship message: " + JSON.stringify(shipPosition));
            // socket.emit('spawn-ship', shipPosition);// kewl
            //socket.broadcast.emit('spawn-ship', shipRequest);// kewl
        }
        catch (e) {
            synLogger.error("ship message: " + JSON.stringify(shipRequest));
        }
    }

    spawnShip(shipRequest, socket)
    {
        try
        {
            this.ships.push(shipRequest);
            synLogger.debug("ship message: " + JSON.stringify(shipRequest));
            socket.emit('spawn-ship', shipRequest);
            socket.broadcast.emit('spawn-ship', shipRequest);
        }
        catch (e)
        {
            synLogger.error("ship message: " + JSON.stringify(shipRequest));
        }
    }
}