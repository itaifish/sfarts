"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionState = void 0;
const board_components_1 = require("phaser3-rex-plugins/plugins/board-components");
const logger_1 = __importStar(require("../../shared/utility/logger"));
const specialAction_1 = require("../../shared/game/move/specialAction");
const math_1 = __importDefault(require("../../shared/utility/math"));
class GameBoard extends board_components_1.Board {
    constructor(scene, config) {
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
        this.forEachTileXY(function (tileXY, board) {
            const points = board.getGridPoints(tileXY.x, tileXY.y, true);
            gridGraphics.strokePoints(points, true);
        });
        const size = this.getWorldSize();
        scene.add.renderTexture(0, 0, size.x, size.y).draw(gridGraphics).setDepth(-1);
        this.selectedRenderTexture = scene.add.renderTexture(0, 0, size.x, size.y);
        this.specialSelectableRenderTexture = scene.add.renderTexture(0, 0, size.x, size.y);
        gridGraphics.destroy();
        this.setInteractive()
            .on("tiledown", (pointer, tileXY) => {
            if (pointer.leftButtonDown()) {
                logger_1.default(`Clicked on tile ${tileXY.x},${tileXY.y}`, this.constructor.name, logger_1.LOG_LEVEL.TRACE);
                const unit = this.tileXYZToChess(tileXY.x, tileXY.y, 1);
                if (unit) {
                    // if clicking on ally unit - try to select
                    if (unit.gameUnit.controller == this.scene.gameManager.controllerId) {
                        logger_1.default(`Clicked on unit ${JSON.stringify(unit.gameUnit.unitStats)}`, this.constructor.name, logger_1.LOG_LEVEL.TRACE);
                        if (this.state === ActionState.IDLE) {
                            this.setSelected(tileXY, unit);
                        }
                    }
                    else {
                        //   if clicking on enemy unit, try to attack
                        if (this.state === ActionState.ATTACKING) {
                            const damage = this.selected[1].gameUnit.unitStats.damage;
                            unit.gameUnit.unitStats.health -= damage;
                            this.selected[1].gameUnit.useSpecialAction(specialAction_1.SpecialActionName.ATTACK);
                            const special = {
                                actionName: specialAction_1.SpecialActionName.ATTACK,
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
            .on("tilemove", (pointer, tileXY) => {
            if (this.state == ActionState.SELECTED) {
                this.selectedPath.length = 1;
                this.getPath(this.selected[1], tileXY, this.selectedPath);
                const distanceBetween = this.selectedPath.reduce((acc, curr, idx, arr) => {
                    if (idx == 0) {
                        return 0;
                    }
                    else {
                        return acc + this.getDistance(arr[idx - 1], curr);
                    }
                }, 0);
                if (distanceBetween <= this.selected[1].gameUnit.unitStats.movesRemaining) {
                    this.drawPath(this.selectedPath);
                    this.moveTo = { x: tileXY.x, y: tileXY.y };
                }
                else {
                    this.moveTo = null;
                }
            }
        });
        this.scene.input.on("pointerup", (pointer) => {
            const distanceBetween = this.selected && this.moveTo ? this.getDistance(this.selected[0], this.moveTo) : 0;
            logger_1.default(`Distance between: ${distanceBetween}`, this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
            if (pointer.leftButtonReleased() && this.state == ActionState.SELECTED && distanceBetween > 0) {
                const unitMovingOnTopOf = this.moveTo
                    ? this.tileXYToChessArray(this.moveTo.x, this.moveTo.y)
                    : null;
                if (!((unitMovingOnTopOf === null || unitMovingOnTopOf === void 0 ? void 0 : unitMovingOnTopOf.length) > 0)) {
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
                                const move = {
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
        this.scene.input.on("pointerdown", (pointer) => {
            if (pointer.rightButtonDown() &&
                (this.state == ActionState.SELECTED || this.state == ActionState.ATTACKING)) {
                this.unSelect();
            }
        });
        this.scene.input.keyboard.on("keydown-A", () => {
            const unit = this.selected[1];
            const attackKey = specialAction_1.SpecialActionName.ATTACK;
            if (unit &&
                unit.gameUnit.specialMoves.includes(attackKey) &&
                unit.gameUnit.canUseSpecial(attackKey) &&
                this.state == ActionState.SELECTED) {
                // check if unit has already moved
                // for now just check if starting position is equal to current position
                if (math_1.default.locationEquals(unit.gameUnit.turnStartLocation, unit.gameUnit.location)) {
                    const positionsAroundUnit = this.filledRingToTileXYArray(unit.gameUnit.location, unit.gameUnit.unitStats.range);
                    this.selectableLocations = positionsAroundUnit.filter((position) => {
                        const unit = this.tileXYZToChess(position.x, position.y, 1);
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
    getWorldCameraOrigin() {
        return this.tileXYToWorldXY(-1, -1);
    }
    getWorldSize() {
        return this.tileXYToWorldXY(this.scene.width, this.scene.height);
    }
    drawSelectableLocations() {
        this.specialSelectableRenderTexture.clear();
        this.specialSelectableFillGraphics.clear();
        this.selectableLocations.forEach((location) => {
            this.specialSelectableFillGraphics.fillPoints(this.getGridPoints(location.x, location.y, true), true);
        });
        this.specialSelectableRenderTexture.draw(this.specialSelectableFillGraphics);
    }
    setSelected(location, unit) {
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
    drawPath(tileXYArray) {
        this.pathGraphics.strokePoints(this.tileXYArrayToWorldXYArray(tileXYArray));
        this.pathTexture.clear().draw(this.pathGraphics);
        this.pathGraphics.clear();
        return this;
    }
    getPath(chess, endTileXY, out) {
        return this.pathFinder.setChess(chess).findPath(endTileXY, undefined, false, out);
    }
}
exports.default = GameBoard;
var ActionState;
(function (ActionState) {
    ActionState["IDLE"] = "idle";
    ActionState["SELECTED"] = "selected";
    ActionState["ATTACKING"] = "attacking";
    ActionState["MOVING"] = "moving";
})(ActionState = exports.ActionState || (exports.ActionState = {}));
//# sourceMappingURL=gameBoard.js.map