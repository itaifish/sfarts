import GameScene from "./scene/gameScene";
import { Board } from "phaser3-rex-plugins/plugins/board-components";
import Location from "../../shared/game/location";
import PhaserGameUnit from "./units/phaserGameUnit";
import log, { LOG_LEVEL } from "../../shared/utility/logger";
import RenderTexture = Phaser.GameObjects.RenderTexture;

export default class GameBoard extends Board {
    scene: GameScene;
    selected: Location;
    selectedRenderTexture: RenderTexture;
    selectedFillGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: GameScene, config: any) {
        // create board
        super(scene, config);
        this.scene = scene;
        this.selected = null;
        // draw grid
        this.selectedFillGraphics = scene.add.graphics({
            fillStyle: {
                color: 0x0071ff,
                alpha: 0.85,
            },
        });
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
        this.selectedRenderTexture = scene.add.renderTexture(0, 0, size.x, size.y);
        gridGraphics.destroy();

        this.setInteractive().on("tiledown", (pointer: any, tileXY: any) => {
            log(`Clicked on tile ${tileXY.x},${tileXY.y}`, this.constructor.name, LOG_LEVEL.TRACE);
            const unit: PhaserGameUnit = this.tileXYZToChess(tileXY.x, tileXY.y, 1);
            if (unit) {
                this.setSelected(tileXY);
            }
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

    setSelected(location: Location): void {
        this.selectedRenderTexture.clear();
        this.selectedFillGraphics.clear();
        this.selectedFillGraphics.fillPoints(this.getGridPoints(location.x, location.y, true), true);
        this.selectedRenderTexture.draw(this.selectedFillGraphics);
        this.selected = location;
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
