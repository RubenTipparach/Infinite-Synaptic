let app = require('express')();
let fs = require('fs');
let clientServer = require('socket.io-client');

let colors = require('colors');
let synLogger = require('../logger.js');
let strformat = require('strformat');

synLogger.level = 'error';
synLogger.info('Initializing...');

// general clients go here.
let clients = [];

let connections = {
    unityClients: [],
    unityServer: [],
    webClients: []
};

let unityGame;

/*
 * summary:
 *  This module will handle all the game connection protocols for this server.
 *  This can be used for various game modules besides taccom.
 *  Eventually, this will be availible to twitch streamers to play as well.
 */
module.exports = (io, game) => {

    // choose what kind of server to "instantiate..."
    if (game == "fh-taccom")
    {
        let game = require("./fh-taccom.js");
        unityGame = new game(connections);
    }

    synLogger.info("Server has started.");

    // socket initialization code for server <-> server.
    io.sockets.on('connection', (socket) => {
        try {
            clients.push(socket);
            unityGame.initializeEvents(socket);

            synLogger.info("A client has connected...".yellow.bold);

            // sends a message to the client.
            socket.emit("intialize", {
                data: "test package from server",
               });


            socket.on('register-unity-server', (uServer) => {
                // should only allow one, or will spawn instances of socket.io
                registerConnection(socket, uServer, 'unityServer');
                unityGame.initializeServerSocket(socket);
            });

            socket.on('register-unity-client', (uClient) => {
                registerConnection(socket, uClient, 'unityClients');
            });

            socket.on('register-web-client', (wClient) => {
                registerConnection(socket, wClient, 'webClients');
                unityGame.registerWebClient(socket);
            });

            // disconnection procedure.
            socket.on('disconnect', () => {
                onDisconnect(socket)
            });
        }
          catch (e) {
            synLogger.error(e);
        }
    });
};

/*
 * summary:
 *  Handles the registration of incomming connections.
 *      Connections fall into 3 categories:
 *      1. Unity game server
 *      2. Unity game client (android, ios, pc, mac, linux etc...)
 *      3. Web Client - light weight HTML interface. Can be used for ship UI as well.
 * parameters:
 *  socket - the socket that will trigger events on the server/clients.
 *  client - The client data package. Can include a number of things, its pretty simple right now.
 *  connectionType - connection type string index.
 */
function registerConnection(socket, client, connectionType)
{
    try {
        synLogger.debug("server id: " + client.serverId + " room: " + connectionType);
        synLogger.debug("socket id: " + socket.id);
        clients.push(socket);
        connections[connectionType].push(socket);

        // represents the different types of socket conenctions.
       // socket.join(connectionType);
    }
    catch (e) {
        synLogger.error(e);
    }
}

/*
 * summary:
 *  Handles the disconnection of clients/servers
 * parameters:
 *  socket - the socket; its reference will be used to splice from the arrays.
 */
function onDisconnect(socket)
{
    try {

        let boolKnownDisconnect = false;

        let i = clients.indexOf(socket);
        clients.splice(i, 1);

        for (let index in connections) {
            let j = connections[index].indexOf(socket);
            if (j != -1) {
                synLogger.warn(index.red.bold + " has disconnected");
                connections[index].splice(j, 1);
                boolKnownDisconnect = true;
            }
        }

        if (!boolKnownDisconnect)
        {
            synLogger.warn("unkown user".red.bold + " has disconnected");
        }
    }
    catch (e) {
        synLogger.error(e);
    }

}