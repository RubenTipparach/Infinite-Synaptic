/// <reference path="phaser.d.ts"/>
// <reference path="socket.d.ts"/>
import * as sio from 'socket.io-client';
import * as BasicShip from "./BasicShip";

let socket = sio.connect('localhost:3000');

class SimpleGame {

    game: Phaser.Game;

    spawnGroup: Phaser.Group;
    spawner: Phaser.Sprite;

    socket: SocketIOClient.Socket;

    ships: Array<BasicShip.BasicShip>;

    constructor() {

        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content',
            {
                preload: this.preload,
                create: this.create,
                render: this.render,
                update: this.update
            });

        this.ships = [];

        socket.on('intialize', (data) => {
            console.log("recieved: " + data.data);
            
        });

        socket.on('spawn-ship', (data) => {
            console.log("server has spawned stuff  " + JSON.stringify(data));

            let ship = this.game.add.sprite(data.position.x, data.position.y, 'R1-Fighter');
            this.ships.push(new BasicShip.BasicShip(data.shipId, ship));

            console.log("currently has: " + this.ships);
        });
        //this.game.input.mouse.capture = true;

        socket.on('move-ship', (data) => {
            console.log("Moved stuff  " + JSON.stringify(data));
        });
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

        let sockholder = { socket: this.socket };


        this.spawner.events.onDragStart.add(() => {
            console.log("fired input");
            let pointer = this.game.input.activePointer;

            let x = pointer.x - 12;
            let y = pointer.y - 22;

            //let ship = this.game.add.sprite(x, y, 'R1-Fighter'); let the server dictate.

            socket.emit('register-web-client', { serverId: "ruben's web client" });
            socket.emit('spawn-ship', {
                position: {
                    x: x,
                    y: y
                }
            });

            
        }, this);
    }


    render() {

        let pointer = this.game.input.activePointer;

        //leaving these events here, though I probably dont need them yet
        //this.game.debug.text("Left Button: " + pointer.leftButton.isDown, 300, 132);
        //this.game.debug.text("Middle Button: " + pointer.middleButton.isDown, 300, 196);
        //this.game.debug.text("Right Button: " + pointer.rightButton.isDown, 300, 260);

        this.spawner.position.set(pointer.x - 32, pointer.y - 32);
    }

    update() {

    }
    
}

window.onload = () => {

    var game = new SimpleGame();

};