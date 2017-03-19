"use strict";
/// <reference path="phaser.d.ts"/>
// <reference path="socket.d.ts"/>
var sio = require("socket.io-client");
var BasicShip = require("./BasicShip");
var socket = sio.connect('localhost:3000');
var SimpleGame = (function () {
    function SimpleGame() {
        var _this = this;
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            render: this.render,
            update: this.update
        });
        this.ships = [];
        socket.on('intialize', function (data) {
            console.log("recieved stuff: " + JSON.stringify(data));
        });
        socket.on('spawn-ship', function (data) {
            console.log("server has spawned stuff  " + JSON.stringify(data));
            var ship = _this.game.add.sprite(data.position.x, data.position.y, 'R1-Fighter');
            _this.ships['ship' + data.shipId] = (new BasicShip.BasicShip(data.shipId, ship));
            console.log("currently has: " + _this.ships);
        });
        //this.game.input.mouse.capture = true;
        socket.on('move-ship', function (data) {
            console.log("Moved stuff  " + JSON.stringify(data));
            _this.ships['ship' + data.shipId].ship.position.set(data.x, data.y);
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('R1-Fighter', 'assets/images/R1-Fighter.png');
        this.game.load.image('R2-Frigate', 'assets/images/phaser2.png');
        this.game.load.image('rectangle', 'assets/images/rectangle.png');
    };
    SimpleGame.prototype.create = function () {
        var _this = this;
        this.spawnGroup = this.game.add.group();
        this.spawner = this.spawnGroup.create(0, 0, 'rectangle');
        this.spawner.inputEnabled = true;
        this.spawner.input.enableDrag();
        var sockholder = { socket: this.socket };
        this.spawner.events.onDragStart.add(function () {
            console.log("fired input");
            var pointer = _this.game.input.activePointer;
            var x = pointer.x - 12;
            var y = pointer.y - 22;
            //let ship = this.game.add.sprite(x, y, 'R1-Fighter'); let the server dictate.
            socket.emit('register-web-client', { serverId: "ruben's web client" });
            socket.emit('spawn-ship', {
                position: {
                    x: x,
                    y: y
                }
            });
        }, this);
    };
    SimpleGame.prototype.render = function () {
        var pointer = this.game.input.activePointer;
        //leaving these events here, though I probably dont need them yet
        //this.game.debug.text("Left Button: " + pointer.leftButton.isDown, 300, 132);
        //this.game.debug.text("Middle Button: " + pointer.middleButton.isDown, 300, 196);
        //this.game.debug.text("Right Button: " + pointer.rightButton.isDown, 300, 260);
        this.spawner.position.set(pointer.x - 32, pointer.y - 32);
    };
    SimpleGame.prototype.update = function () {
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map