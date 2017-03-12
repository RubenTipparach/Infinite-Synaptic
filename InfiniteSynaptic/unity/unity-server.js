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

        clients.push(socket);

        synLogger.info("A client has connected...".yellow.bold);

        // sends a message to the client.
        socket.emit("intialize", {
            data:"test package from server"
            //normally add data here.
        });

        socket.on('register-unity-server', (uServer) => {

            try
            {
                synLogger.debug("server id: " + uServer.serverId);
                synLogger.debug("socket id: " + socket.id);
                clients.push(socket);
                connections.unityServer.push(socket);
            }
            catch (e)
            {
                synLogger.error(e);
            }
        });

        socket.on('register-unity-client', (uClient) => {

            try {
                synLogger.debug("server id: " + uClient.serverId);
                synLogger.debug("socket id: " + socket.id);
                clients.push(socket);
                connections.unityClients.push(socket);
            }
            catch (e) {
                synLogger.error(e);
            }
        });

        socket.on('register-web-client', (wClient) => {

            try {
                synLogger.debug("server id: " + wClient.serverId);
                synLogger.debug("socket id: " + socket.id);
                clients.push(socket);
                connections.webClients.push(socket);
            }
            catch (e) {
                synLogger.error(e);
            }
        });

        // disconnection procedure.
        socket.on('disconnect', () => {
            onDisconnect(socket)
        });
    });
};


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