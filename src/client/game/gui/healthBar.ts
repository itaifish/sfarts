import log from "../../../shared/utility/logger";
import { LOG_LEVEL } from "../../../shared/utility/logger";
import GameScene from "../scene/gameScene";
import PhaserGameUnit from "../units/phaserGameUnit";

export default class HealthBar {
    bar: Phaser.GameObjects.Graphics;
    parentUnit: PhaserGameUnit;
    scene: GameScene;
    barHeight: number;

    constructor(scene: GameScene, parentUnit: PhaserGameUnit) {
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

    onParentUnitMove(): void {
        this.draw();
        this.parentUnit.once("drawHealth", this.onParentUnitMove);
    }

    draw() {
        this.bar.clear();
        const worldPosition = this.scene.board.tileXYToWorldXY(
            this.parentUnit.gameUnit.location.x,
            this.parentUnit.gameUnit.location.y,
        );
        const barXY = {
            x: worldPosition.x - this.parentUnit.displayWidth / 2,
            y: worldPosition.y - this.parentUnit.displayHeight / 2 - this.barHeight - 10,
        };
        // draw background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(barXY.x, barXY.y, this.parentUnit.displayWidth, this.barHeight);
        const border = 2;
        const innerDimension = [
            barXY.x + border,
            barXY.y + border,
            this.parentUnit.displayWidth - border,
            this.barHeight - border,
        ];
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(innerDimension[0], innerDimension[1], innerDimension[2], innerDimension[3]);
        const healthPercentWidth =
            this.parentUnit.displayWidth *
            (this.parentUnit.gameUnit.unitStats.health / this.parentUnit.gameUnit.unitStats.maxHealth);
        const ally = this.parentUnit.gameUnit.controller == this.scene.client.userId;
        if (ally) {
            this.bar.fillStyle(0x00ffc2);
        } else {
            this.bar.fillStyle(0xff1122);
        }
        this.bar.fillRect(innerDimension[0], innerDimension[1], healthPercentWidth, innerDimension[3]);
    }
}
