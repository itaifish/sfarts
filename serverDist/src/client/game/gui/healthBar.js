"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HealthBar {
    constructor(scene, parentUnit) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.parentUnit = parentUnit;
        this.scene = scene;
        this.barHeight = 15;
        this.draw = this.draw.bind(this);
        this.draw();
        this.scene.add.existing(this.bar);
        this.onParentUnitMove = this.onParentUnitMove.bind(this);
        parentUnit.once("drawHealth", this.onParentUnitMove);
    }
    onParentUnitMove() {
        this.draw();
        this.parentUnit.once("drawHealth", this.onParentUnitMove);
    }
    draw() {
        this.bar.clear();
        const worldPosition = this.scene.board.tileXYToWorldXY(this.parentUnit.gameUnit.location.x, this.parentUnit.gameUnit.location.y);
        const barXY = {
            x: worldPosition.x - this.parentUnit.displayWidth / 2,
            y: worldPosition.y - this.parentUnit.displayHeight / 2 - this.barHeight - 10,
        };
        // draw background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(barXY.x, barXY.y, this.parentUnit.displayWidth, this.barHeight);
        if (this.parentUnit.gameUnit.unitStats.health > 0) {
            const border = 2;
            const innerDimension = [
                barXY.x + border,
                barXY.y + border,
                this.parentUnit.displayWidth - border,
                this.barHeight - border,
            ];
            this.bar.fillStyle(0xffffff);
            this.bar.fillRect(innerDimension[0], innerDimension[1], innerDimension[2], innerDimension[3]);
            const healthPercentWidth = this.parentUnit.displayWidth *
                (this.parentUnit.gameUnit.unitStats.health / this.parentUnit.gameUnit.unitStats.maxHealth);
            const ally = this.parentUnit.gameUnit.controller == this.scene.client.userId;
            if (ally) {
                // Draw remaining moves
                const movesBarXY = {
                    x: barXY.x,
                    y: barXY.y - this.barHeight / 2 - border,
                };
                this.bar.fillStyle(0x000000);
                this.bar.fillRect(movesBarXY.x, movesBarXY.y, this.parentUnit.displayWidth, this.barHeight / 2);
                const innerDimension = [
                    movesBarXY.x + border,
                    movesBarXY.y + border,
                    this.parentUnit.displayWidth - border,
                    this.barHeight / 2 - border,
                ];
                this.bar.fillStyle(0xffffff);
                this.bar.fillRect(innerDimension[0], innerDimension[1], innerDimension[2], innerDimension[3]);
                const movesPercentWidth = this.parentUnit.displayWidth *
                    (this.parentUnit.gameUnit.unitStats.movesRemaining / this.parentUnit.gameUnit.unitStats.moveSpeed);
                this.bar.fillStyle(0xffd300);
                this.bar.fillRect(innerDimension[0], innerDimension[1], movesPercentWidth, innerDimension[3]);
                this.bar.fillStyle(0x00ffc2);
            }
            else {
                this.bar.fillStyle(0xff1122);
            }
            this.bar.fillRect(innerDimension[0], innerDimension[1], healthPercentWidth, innerDimension[3]);
        }
    }
}
exports.default = HealthBar;
//# sourceMappingURL=healthBar.js.map