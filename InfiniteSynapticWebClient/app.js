"use strict";
/// <reference path="phaser.d.ts"/>
// <reference path="socket.d.ts"/>
var sio = require("socket.io-client");
var socket = sio.connect('localhost:3000');
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            render: this.render,
            update: this.update
        });
        socket.on('intialize', function (data) {
            console.log("recieved: " + data.data);
        });
        //this.game.input.mouse.capture = true;
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
            var ship = _this.game.add.sprite(x, y, 'R1-Fighter');
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
        //this.game.debug.text("Left Button: " + pointer.leftButton.isDown, 300, 132);
        //this.game.debug.text("Middle Button: " + pointer.middleButton.isDown, 300, 196);
        //this.game.debug.text("Right Button: " + pointer.rightButton.isDown, 300, 260);
        //this.game.debug.text("x: " + pointer.x, 300, 300);
        //this.game.debug.text("y: " + pointer.y, 300, 315);
        this.spawner.position.set(pointer.x - 32, pointer.y - 32);
        //if (pointer.leftButton.isDown)
        //{
        //}
    };
    SimpleGame.prototype.update = function () {
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map