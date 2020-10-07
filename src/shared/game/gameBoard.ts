import GameScene from "./scene/gameScene";
import { Board } from "phaser3-rex-plugins/plugins/board-components";

export default class GameBoard extends Board {
    constructor(scene: GameScene, config: any) {
        // create board
        super(scene, config);
        // draw grid
        const gridGraphics = scene.add.graphics({
            lineStyle: {
                width: 1,
                color: 0x007ac1,
                alpha: 1,
            },
        });
        this.forEachTileXY(function (tileXY: any, board: any) {
            const points = board.getGridPoints(tileXY.x, tileXY.y, true);
            gridGraphics.strokePoints(points, true);
        });
        scene.add.renderTexture(0, 0, 800, 600).draw(gridGraphics).setDepth(-1);
        gridGraphics.destroy();

        this.pathGraphics = scene.add.graphics({
            lineStyle: {
                width: 1,
                color: 0x007ac1,
                alpha: 1,
            },
        });
        this.pathTexture = scene.add.renderTexture(0, 0, 800, 600).setDepth(2);

        this.pathFinder = scene["rexBoard"].add.pathFinder({
            occupiedTest: true,
            pathMode: "A*",
        });
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
