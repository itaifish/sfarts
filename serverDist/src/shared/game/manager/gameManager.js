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
const gameUnit_1 = __importDefault(require("../units/gameUnit"));
const logger_1 = __importStar(require("../../utility/logger"));
const moveHistory_1 = __importDefault(require("../move/moveHistory"));
const specialAction_1 = require("../move/specialAction");
const convertToString_1 = __importDefault(require("../../utility/convertToString"));
class GameManager {
    constructor(gameId, controllerId, allPlayers, boardState) {
        this.gameId = gameId;
        this.controllerId = controllerId;
        if (boardState) {
            this.boardState = boardState;
        }
        else {
            this.boardState = new Array(5);
        }
        this.moveHistory = new moveHistory_1.default(allPlayers);
        this.playerIds = allPlayers;
        this.endedTurnMap = new Set();
    }
    copyBoardState(boardState) {
        this.boardState = [];
        for (let y = 0; y < boardState.length; y++) {
            this.boardState.push([]);
            for (let x = 0; x < boardState[y].length; x++) {
                const oldGameUnit = boardState[y][x];
                if (oldGameUnit) {
                    this.boardState[y].push(new gameUnit_1.default(oldGameUnit.controller, oldGameUnit.team, oldGameUnit.unitStats, oldGameUnit.specialMoves, oldGameUnit.location, oldGameUnit.name));
                }
                else {
                    this.boardState[y].push(null);
                }
            }
        }
    }
    addMovesForPlayer(playerId, moveList) {
        moveList.forEach((move) => {
            this.moveHistory.playerMove(playerId, move);
        });
    }
    addSpecialsForPlayer(playerId, specialList) {
        specialList.forEach((special) => {
            this.moveHistory.playerSpecial(playerId, special);
        });
    }
    getNumTurns() {
        return this.moveHistory.history.length;
    }
    playerSendsEndTurnSignal(playerId, endTurn) {
        if (endTurn) {
            this.endedTurnMap.add(playerId);
        }
        else {
            this.endedTurnMap.delete(playerId);
        }
    }
    allPlayersHaveEndedTurn() {
        return this.endedTurnMap.size == this.playerIds.length;
    }
    endTurn() {
        // Do Specials **FIRST** and then moves
        const turnHistory = this.moveHistory.saveAndGetTurnHistory();
        Object.keys(turnHistory).forEach((playerId) => {
            const playerIdNum = parseInt(playerId);
            Object.keys(turnHistory[playerIdNum]).forEach((locationKey) => {
                this.doSpecial(turnHistory[playerIdNum][locationKey].specialAction);
            });
        });
        Object.keys(turnHistory).forEach((playerId) => {
            const playerIdNum = parseInt(playerId);
            Object.keys(turnHistory[playerIdNum]).forEach((locationKey) => {
                const moveAction = turnHistory[playerIdNum][locationKey].moveAction;
                if (moveAction) {
                    const unitDoingAction = this.getUnitAt(moveAction.unitDoingAction.turnStartLocation);
                    // copy over health and stuff
                    this.moveUnit(unitDoingAction, unitDoingAction.turnStartLocation, moveAction.targetedCoordinates);
                }
            });
        });
        // copy over own boardstate because passed in objects lose their functions
        // TODO: fix this feature in the server so this inefficiency does not have to happen
        this.copyBoardState(this.boardState);
        this.boardState.forEach((row, rowIdx) => {
            row.forEach((gameUnit, colIdx) => {
                if (gameUnit) {
                    if (gameUnit.unitStats.health <= 0) {
                        logger_1.default(`gameUnit ${gameUnit.name} is dying, at position ${gameUnit.location.x}, ${gameUnit.location.y}`, this.constructor.name, logger_1.LOG_LEVEL.TRACE);
                        this.setUnitAt({ x: colIdx, y: rowIdx }, null);
                    }
                    else {
                        gameUnit.processNewTurn();
                    }
                }
            }, this);
        }, this);
        this.endedTurnMap.clear();
    }
    resetPlayerMoves(playerId) {
        this.moveHistory.resetPlayerMoves(playerId);
        return this.boardState;
    }
    getUnitAt(location) {
        if (location && this.boardState[location.y]) {
            return this.boardState[location.y][location.x];
        }
        return null;
    }
    setUnitAt(location, unit) {
        this.boardState[location.y][location.x] = unit;
    }
    moveUnit(unitMoving, oldLocation, newLocation) {
        if (unitMoving.turnStartLocation != oldLocation) {
            logger_1.default(`${convertToString_1.default(unitMoving.turnStartLocation)} is not equal to ${convertToString_1.default(oldLocation)}`, this.constructor.name, logger_1.LOG_LEVEL.ERROR);
        }
        else {
            this.setUnitAt(oldLocation, null);
            const newLocationUnit = this.getUnitAt(newLocation);
            if (newLocationUnit) {
                if (newLocationUnit.team == unitMoving.team) {
                    logger_1.default(`${unitMoving} is on the same team (${unitMoving.team}) as ${newLocationUnit}`, this.constructor.name, logger_1.LOG_LEVEL.ERROR);
                }
                else {
                    // Smash Health
                    const higherHealthUnit = newLocationUnit.unitStats.health > unitMoving.unitStats.health ? newLocationUnit : unitMoving;
                    const lowerHealth = Math.min(newLocationUnit.unitStats.health, unitMoving.unitStats.health);
                    higherHealthUnit.unitStats.health -= lowerHealth;
                    this.setUnitAt(newLocation, higherHealthUnit);
                    unitMoving.location = newLocation;
                }
            }
            else {
                this.setUnitAt(newLocation, unitMoving);
                unitMoving.location = newLocation;
            }
        }
    }
    doSpecial(action) {
        var _a, _b, _c;
        if (!action) {
            return;
        }
        if (action.actionName == specialAction_1.SpecialActionName.ATTACK) {
            const unitAttacking = this.getUnitAt((_a = action.unitDoingAction) === null || _a === void 0 ? void 0 : _a.turnStartLocation);
            if (((_c = (_b = action.unitDoingAction) === null || _b === void 0 ? void 0 : _b.unitStats) === null || _c === void 0 ? void 0 : _c.damage) != (unitAttacking === null || unitAttacking === void 0 ? void 0 : unitAttacking.unitStats.damage)) {
                logger_1.default(`ERROR: Damage is not consistent, likely refering to different gameobjects or something is incorrectly null`, this.constructor.name, logger_1.LOG_LEVEL.WARN);
            }
            else {
                const unitBeingAttacked = this.getUnitAt(action.targetedCoordinates);
                if (!unitBeingAttacked || (unitAttacking === null || unitAttacking === void 0 ? void 0 : unitAttacking.controller) == (unitBeingAttacked === null || unitBeingAttacked === void 0 ? void 0 : unitBeingAttacked.controller)) {
                    logger_1.default(`ERROR: unit is attacking null or an ally`, this.constructor.name, logger_1.LOG_LEVEL.WARN);
                }
                else {
                    unitBeingAttacked.unitStats.health -= unitAttacking.unitStats.damage;
                    logger_1.default(`Unit for player ${unitBeingAttacked.controller} took ${unitAttacking.unitStats.damage} damage, health is now at ${unitBeingAttacked.unitStats.health}`, this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
                }
            }
        }
    }
}
exports.default = GameManager;
//# sourceMappingURL=gameManager.js.map