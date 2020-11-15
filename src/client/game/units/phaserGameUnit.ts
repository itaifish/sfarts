import Phaser from "phaser";
import GameScene from "../scene/gameScene";

export default class PhaserGameUnit extends Phaser.GameObjects.Sprite {
    moveTo: any;
    pathFinder: any;

    constructor(scene: GameScene, x: number, y: number, texture: string | Phaser.Textures.Texture) {
        super(scene, x, y, texture);
        this.moveTo = scene["rexBoard"].add.moveTo(this);
        this.pathFinder = scene["rexBoard"].add.pathFinder(this, {
            occupiedTest: true,
            pathMode: "A*",
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
