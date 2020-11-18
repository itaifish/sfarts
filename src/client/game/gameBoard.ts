import GameScene from "./scene/gameScene";
import { Board } from "phaser3-rex-plugins/plugins/board-components";
import Location from "../../shared/game/location";
import PhaserGameUnit from "./units/phaserGameUnit";
import log, { LOG_LEVEL } from "../../shared/utility/logger";

export default class GameBoard extends Board {
    scene: GameScene;
    selected: [Location, PhaserGameUnit];
    selectedRenderTexture: Phaser.GameObjects.RenderTexture;
    selectedFillGraphics: Phaser.GameObjects.Graphics;
    state: ActionState;
    selectedPath: any[];
    moveTo: Location;

    constructor(scene: GameScene, config: any) {
        // create board
        super(scene, config);
        this.scene = scene;
        this.selected = null;
        this.state = ActionState.IDLE;
        this.moveTo = { x: 0, y: 0 };
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

        this.setInteractive()
            .on("tiledown", (pointer: Phaser.Input.Pointer, tileXY: any) => {
                if (pointer.leftButtonDown()) {
                    log(`Clicked on tile ${tileXY.x},${tileXY.y}`, this.constructor.name, LOG_LEVEL.TRACE);
                    const unit: PhaserGameUnit = this.tileXYZToChess(tileXY.x, tileXY.y, 1);
                    if (unit) {
                        if (this.state === ActionState.IDLE) {
                            this.setSelected(tileXY, unit);
                        }
                    }
                }
            })
            .on("tilemove", (pointer: Phaser.Input.Pointer, tileXY: any) => {
                if (this.state == ActionState.SELECTED) {
                    this.selectedPath.length = 1;
                    const distanceBetween = this.getDistance(this.selected[0], tileXY);
                    if (distanceBetween <= this.selected[1].gameUnit.unitStats.movesRemaining) {
                        this.drawPath(this.getPath(this.selected[1], tileXY, this.selectedPath));
                        this.moveTo = { x: tileXY.x, y: tileXY.y };
                    }
                }
            });
        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonReleased() && this.state == ActionState.SELECTED) {
                this.selected[1]
                    .once("move.complete", () => {
                        this.clearPath();
                        this.state = ActionState.IDLE;
                        if (this.moveTo) {
                            const distanceBetween = this.getDistance(this.selected[0], this.moveTo);
                            this.selected[1].gameUnit.useMovesTo(distanceBetween, this.moveTo);
                            //Re-set selection (because move)
                            this.setSelected(this.selected[1].gameUnit.location, this.selected[1]);
                        }
                    })
                    .moveAlongPath(this.selectedPath);
                this.state = ActionState.MOVING;
            }
        });
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.setSelected(null, null);
                this.moveTo = null;
                this.state = ActionState.IDLE;
                this.clearPath();
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

    setSelected(location: Location, unit: PhaserGameUnit): void {
        this.selectedRenderTexture.clear();
        this.selectedFillGraphics.clear();
        if (unit) {
            this.selectedFillGraphics.fillPoints(this.getGridPoints(location.x, location.y, true), true);
            this.selectedRenderTexture.draw(this.selectedFillGraphics);
            this.selected = [{ x: location.x, y: location.y }, unit];
            this.state = ActionState.SELECTED;
            this.selectedPath = [this.chessToTileXYZ(unit)];
        }
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

enum ActionState {
    IDLE = "idle",
    SELECTED = "selected",
    MOVING = "moving",
}
