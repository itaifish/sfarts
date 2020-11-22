import GameScene from "./scene/gameScene";
import { Board } from "phaser3-rex-plugins/plugins/board-components";
import Location from "../../shared/game/location";
import PhaserGameUnit from "./units/phaserGameUnit";
import log, { LOG_LEVEL } from "../../shared/utility/logger";
import MoveAction from "../../shared/game/move/moveAction";
import SpecialAction, { SpecialActionName } from "../../shared/game/move/specialAction";
import MathUtility from "../../shared/utility/math";

export default class GameBoard extends Board {
    scene: GameScene;
    selected: [Location, PhaserGameUnit];
    selectedRenderTexture: Phaser.GameObjects.RenderTexture;
    selectedFillGraphics: Phaser.GameObjects.Graphics;
    specialSelectableRenderTexture: Phaser.GameObjects.RenderTexture;
    specialSelectableFillGraphics: Phaser.GameObjects.Graphics;
    selectableLocations: Location[];
    state: ActionState;
    selectedPath: any[];
    moveTo: Location;

    constructor(scene: GameScene, config: any) {
        // create board
        super(scene, config);
        this.scene = scene;
        this.selected = null;
        this.state = ActionState.IDLE;
        this.selectableLocations = [];
        this.moveTo = { x: 0, y: 0 };
        // draw grid
        this.selectedFillGraphics = scene.add.graphics({
            fillStyle: {
                color: 0x0071ff,
                alpha: 0.85,
            },
        });
        this.specialSelectableFillGraphics = scene.add.graphics({
            fillStyle: {
                color: 0xff6622,
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
        this.specialSelectableRenderTexture = scene.add.renderTexture(0, 0, size.x, size.y);
        gridGraphics.destroy();

        this.setInteractive()
            .on("tiledown", (pointer: Phaser.Input.Pointer, tileXY: Location) => {
                if (pointer.leftButtonDown()) {
                    log(`Clicked on tile ${tileXY.x},${tileXY.y}`, this.constructor.name, LOG_LEVEL.TRACE);
                    const unit: PhaserGameUnit = this.tileXYZToChess(tileXY.x, tileXY.y, 1);
                    if (unit) {
                        // if clicking on ally unit - try to select
                        if (unit.gameUnit.controller == this.scene.gameManager.controllerId) {
                            log(
                                `Clicked on unit ${JSON.stringify(unit.gameUnit.unitStats)}`,
                                this.constructor.name,
                                LOG_LEVEL.TRACE,
                            );
                            if (this.state === ActionState.IDLE) {
                                this.setSelected(tileXY, unit);
                            }
                        } else {
                            //   if clicking on enemy unit, try to attack
                            if (this.state === ActionState.ATTACKING) {
                                const damage = this.selected[1].gameUnit.unitStats.damage;
                                unit.gameUnit.unitStats.health -= damage;
                                this.selected[1].gameUnit.useSpecialAction(SpecialActionName.ATTACK);
                                const special: SpecialAction = {
                                    actionName: SpecialActionName.ATTACK,
                                    alliesInvolved: [],
                                    enemiesInvolved: [unit.gameUnit],
                                    amounts: [],
                                    unitDoingAction: this.selected[1].gameUnit,
                                    targetedCoordinates: tileXY,
                                };
                                this.scene.client.sendSpecial(special);
                                this.unSelect();
                                unit.emit("drawHealth");
                            }
                        }
                    }
                }
            })
            .on("tilemove", (pointer: Phaser.Input.Pointer, tileXY: any) => {
                if (this.state == ActionState.SELECTED) {
                    this.selectedPath.length = 1;
                    this.getPath(this.selected[1], tileXY, this.selectedPath);
                    const distanceBetween = this.selectedPath.reduce((acc, curr, idx, arr) => {
                        if (idx == 0) {
                            return 0;
                        } else {
                            return acc + this.getDistance(arr[idx - 1], curr);
                        }
                    }, 0);
                    if (distanceBetween <= this.selected[1].gameUnit.unitStats.movesRemaining) {
                        this.drawPath(this.selectedPath);
                        this.moveTo = { x: tileXY.x, y: tileXY.y };
                    }
                }
            });
        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            const distanceBetween = this.selected && this.moveTo ? this.getDistance(this.selected[0], this.moveTo) : 0;
            log(`Distance between: ${distanceBetween}`, this.constructor.name, LOG_LEVEL.DEBUG);
            if (pointer.leftButtonReleased() && this.state == ActionState.SELECTED && distanceBetween > 0) {
                const unitMovingOnTopOf: any[] = this.moveTo
                    ? this.tileXYToChessArray(this.moveTo.x, this.moveTo.y)
                    : null;
                if (!(unitMovingOnTopOf?.length > 0)) {
                    this.selected[1]
                        .once("move.complete", () => {
                            this.clearPath();
                            this.state = ActionState.IDLE;
                            if (this.selected[1].gameUnit.unitStats.movesRemaining == 0) {
                                this.selected[1].setTint(0xffffff);
                            }
                            if (this.moveTo) {
                                if (distanceBetween > 0) {
                                    this.selected[1].gameUnit.useMovesTo(distanceBetween, this.moveTo);
                                    // send move request to server
                                    const move: MoveAction = {
                                        unitDoingAction: this.selected[1].gameUnit,
                                        targetedCoordinates: this.moveTo,
                                    };
                                    this.scene.client.sendMove(move);
                                    this.selected[1].emit("drawHealth");
                                    //Re-set selection (because move)
                                    this.unSelect();
                                }
                            }
                        })
                        .moveAlongPath(this.selectedPath);
                    this.state = ActionState.MOVING;
                }
            }
        });
        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (
                pointer.rightButtonDown() &&
                (this.state == ActionState.SELECTED || this.state == ActionState.ATTACKING)
            ) {
                this.unSelect();
            }
        });

        this.scene.input.keyboard.on("keydown-A", () => {
            const unit = this.selected[1];
            const attackKey: number = SpecialActionName.ATTACK as number;
            if (
                unit &&
                unit.gameUnit.specialMoves.includes(attackKey) &&
                unit.gameUnit.canUseSpecial(attackKey) &&
                this.state == ActionState.SELECTED
            ) {
                // check if unit has already moved
                // for now just check if starting position is equal to current position
                if (MathUtility.locationEquals(unit.gameUnit.turnStartLocation, unit.gameUnit.location)) {
                    const positionsAroundUnit: Location[] = this.filledRingToTileXYArray(
                        unit.gameUnit.location,
                        unit.gameUnit.unitStats.range,
                    );
                    this.selectableLocations = positionsAroundUnit.filter((position) => {
                        const unit: PhaserGameUnit = this.tileXYZToChess(position.x, position.y, 1);
                        return unit && unit.gameUnit.controller != this.scene.client.userId;
                    });
                    this.state = ActionState.ATTACKING;
                    this.clearPath();
                    this.drawSelectableLocations();
                    //
                }
            }
        });

        this.pathGraphics = scene.add.graphics({
            lineStyle: {
                width: 3,
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

    drawSelectableLocations(): void {
        this.specialSelectableRenderTexture.clear();
        this.specialSelectableFillGraphics.clear();
        this.selectableLocations.forEach((location) => {
            this.specialSelectableFillGraphics.fillPoints(this.getGridPoints(location.x, location.y, true), true);
        });
        this.specialSelectableRenderTexture.draw(this.specialSelectableFillGraphics);
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

    unSelect() {
        this.setSelected(null, null);
        this.moveTo = null;
        this.state = ActionState.IDLE;
        this.clearPath();
        this.selectedRenderTexture.clear();
        this.specialSelectableRenderTexture.clear();
        this.specialSelectableFillGraphics.clear();
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

export enum ActionState {
    IDLE = "idle",
    SELECTED = "selected",
    ATTACKING = "attacking",
    MOVING = "moving",
}
