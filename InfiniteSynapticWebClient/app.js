/// <reference path="phaser.d.ts"/>
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            render: this.render,
            update: this.update
        });
        this.game.input.mouse.capture = true;
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('logo', 'phaser2.png');
    };
    SimpleGame.prototype.create = function () {
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);
        //logo.scale.setTo(0.2, 0.2);
        //this.game.add.tween(logo.scale).to({ x: 1, y: 1 }, 2000, Phaser.Easing.Bounce.Out, true);
    };
    SimpleGame.prototype.render = function () {
        var pointer = this.game.input.activePointer;
        this.game.debug.text("Left Button: " + pointer.leftButton.isDown, 300, 132);
        this.game.debug.text("Middle Button: " + pointer.middleButton.isDown, 300, 196);
        this.game.debug.text("Right Button: " + pointer.rightButton.isDown, 300, 260);
        this.game.debug.text("x: " + pointer.x, 300, 300);
        this.game.debug.text("y: " + pointer.y, 300, 315);
    };
    SimpleGame.prototype.update = function () {
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map