import Phaser from "phaser";
import GameScene from "../scene/gameScene";
import CreateChessData from "phaser3-rex-plugins/plugins/board/chess/GetChessData.js";

export default class PhaserGameUnit extends Phaser.GameObjects.Image {
    moveTo: any;

    constructor(scene: GameScene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        //super(scene.board, x, y, 0, 0x007ac1);
        super(scene, x, y, texture);
        CreateChessData(this);
        this.moveTo = scene["rexBoard"].add.moveTo(this, {
            rotateToTarget: true,
            speed: 700,
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
