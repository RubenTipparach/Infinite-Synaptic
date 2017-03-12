﻿/// <reference path="phaser.d.ts"/>
// <reference path="socket.d.ts"/>
import * as sio from 'socket.io-client';

class SimpleGame {

    game: Phaser.Game;

    spawnGroup: Phaser.Group;
    spawner: Phaser.Sprite;

    socket: SocketIOClient.Socket;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
            {
                preload: this.preload,
                create: this.create,
                render: this.render,
                update: this.update
            });


        this.socket = sio.connect('localhost:3000');
        this.socket.on('intialize', (data) => {
            console.log("recieved: " + data.data);
        });

        this.socket.emit('register-web-client', { serverId: "ruben's web client" });
        //this.game.input.mouse.capture = true;
        
    }


    preload() {
        this.game.load.image('R1-Fighter', 'assets/images/R1-Fighter.png');
        this.game.load.image('R2-Frigate', 'assets/images/phaser2.png');
        this.game.load.image('rectangle', 'assets/images/rectangle.png');
    }

    create() {
        
        this.spawnGroup = this.game.add.group();
        this.spawner = this.spawnGroup.create(0, 0, 'rectangle');

        this.spawner.inputEnabled = true;
        this.spawner.input.enableDrag();
        this.spawner.events.onDragStart.add(() => {
            console.log("fired input");
            let pointer = this.game.input.activePointer;
            var ship = this.game.add.sprite(pointer.x, pointer.y, 'R1-Fighter');
        }, this);
    }

    render() {

        let pointer = this.game.input.activePointer;

        //this.game.debug.text("Left Button: " + pointer.leftButton.isDown, 300, 132);
        //this.game.debug.text("Middle Button: " + pointer.middleButton.isDown, 300, 196);
        //this.game.debug.text("Right Button: " + pointer.rightButton.isDown, 300, 260);

        //this.game.debug.text("x: " + pointer.x, 300, 300);
        //this.game.debug.text("y: " + pointer.y, 300, 315);

        this.spawner.position.set(pointer.x - 32, pointer.y - 32);

        //if (pointer.leftButton.isDown)
        //{
        //}
    }

    update() {

    }
    
}

window.onload = () => {

    var game = new SimpleGame();

};