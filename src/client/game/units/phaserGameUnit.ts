import Phaser from "phaser";
import GameScene from "../scene/gameScene";
import GameUnit from "../../../shared/game/units/gameUnit";
import log, { LOG_LEVEL } from "../../../shared/utility/logger";

export default class PhaserGameUnit extends Phaser.GameObjects.Image {
    moveTo: any;
    gameUnit: GameUnit;

    constructor(scene: GameScene, x: number, y: number, texture: string | Phaser.Textures.Texture, gameUnit: GameUnit) {
        super(scene, x, y, texture);
        this.gameUnit = gameUnit;
        scene.add.existing(this);
        scene.board.addChess(this, x, y, 1);
        this.moveTo = scene["rexBoard"].add.moveTo(this, {
            rotateToTarget: true,
            speed: gameUnit.unitStats.moveSpeed * 100,
        });
    }

    moveAlongPath(path: any[]): PhaserGameUnit | null {
        if (path.length === 0) {
            this.emit("move.complete");
            return;
        }

        this.moveTo.once(
            "complete",
            () => {
                this.moveAlongPath(path);
            },
            this,
        );
        this.moveTo.moveTo(path.shift());
        return this;
    }
}
