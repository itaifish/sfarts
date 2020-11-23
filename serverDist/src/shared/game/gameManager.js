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
const logger_1 = __importStar(require("../utility/logger"));
const moveHistory_1 = __importDefault(require("./move/moveHistory"));
class GameManager {
    constructor(gameId, controllerId, allPlayers, board, boardState) {
        this.gameId = gameId;
        this.controllerId = controllerId;
        this.board = board;
        if (boardState) {
            this.boardState = boardState;
        }
        else {
            this.boardState = new Array(5);
        }
        this.moveHistory = new moveHistory_1.default(allPlayers);
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
    endTurn() {
        // Do Specials **FIRST** and then moves
        const turnHistory = this.moveHistory.saveAndGetTurnHistory();
        Object.keys(turnHistory).forEach((playerId) => {
            Object.keys(turnHistory[playerId]).forEach((locationKey) => {
                this.doSpecial(turnHistory[playerId][locationKey].specialAction);
            });
        });
        Object.keys(turnHistory).forEach((playerId) => {
            Object.keys(turnHistory[playerId]).forEach((locationKey) => {
                const moveAction = turnHistory[playerId][locationKey].moveAction;
                this.moveUnit(moveAction.unitDoingAction, moveAction.unitDoingAction.location, moveAction.targetedCoordinates);
            });
        });
    }
    getUnitAt(location) {
        if (this.boardState[location.x]) {
            return this.boardState[location.x][location.y];
        }
        return null;
    }
    setUnitAt(location, unit) {
        this.boardState[location.x][location.y] = unit;
    }
    moveUnit(unitMoving, oldLocation, newLocation) {
        if (unitMoving != this.getUnitAt(oldLocation)) {
            logger_1.default(`${unitMoving} is not equal to ${this.getUnitAt(oldLocation)}`, this.constructor.name, logger_1.LOG_LEVEL.ERROR);
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
        //
    }
}
exports.default = GameManager;
//# sourceMappingURL=gameManager.js.map