import GameScene from "./scene/gameScene";
import { Board } from "phaser3-rex-plugins/plugins/board-components";

export default class GameBoard extends Board {
    scene: GameScene;

    constructor(scene: GameScene, config: any) {
        // create board
        super(scene, config);
        this.scene = scene;
        // draw grid
        const gridGraphics = scene.add.graphics({
            lineStyle: {
                width: 2,
                color: 0x007ac1,
                alpha: 1,
            },
        });
        this.forEachTileXY(function (tileXY: any, board: any) {
            const points = board.getGridPoints(tileXY.x, tileXY.y, true);
            gridGraphics.strokePoints(points, true);
        });
        const size: { x: number; y: number } = this.getWorldSize();
        scene.add.renderTexture(0, 0, size.x, size.y).draw(gridGraphics).setDepth(-1);
        gridGraphics.destroy();

        this.setInteractive().on("tiledown", (pointer: any, tileXY: any) => {
            console.log(`${tileXY.x},${tileXY.y}`);
        });

        this.pathGraphics = scene.add.graphics({
            lineStyle: {
                width: 1,
                color: 0x007ac1,
                alpha: 1,
            },
        });

        this.pathTexture = scene.add.renderTexture(0, 0, size.x, size.y).setDepth(2);

        this.pathFinder = scene["rexBoard"].add.pathFinder({
            occupiedTest: true,
            pathMode: "A*",
        });
    }

    getWorldCameraOrigin(): { x: number; y: number } {
        return this.tileXYToWorldXY(-1, -1);
    }
    getWorldSize(): { x: number; y: number } {
        return this.tileXYToWorldXY(this.scene.width, this.scene.height);
    }

    clearPath() {
        this.pathTexture.clear();
        return this;
    }

    drawPath(tileXYArray: any) {
        this.pathGraphics.strokePoints(this.tileXYArrayToWorldXYArray(tileXYArray));
        this.pathTexture.clear().draw(this.pathGraphics);
        this.pathGraphics.clear();
        return this;
    }

    getPath(chess: any, endTileXY: any, out: any) {
        return this.pathFinder.setChess(chess).findPath(endTileXY, undefined, false, out);
    }
}
