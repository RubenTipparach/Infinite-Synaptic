/// <reference path="phaser.d.ts"/>

class BasicShip {

    shipId: string;
    ship: Phaser.Sprite;

    constructor(shipId: string, ship: Phaser.Sprite) {
        this.shipId = shipId;
        this.ship = ship;
    }

    getShip()
    {
        return this.ship;
    }

    getShipId() {
        return this.shipId;
    }
}

export { BasicShip };