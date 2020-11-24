"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoveHistory {
    constructor(players) {
        this.history = [{}];
    }
    playerMove(playerId, move) {
        this.verifyPlayerAndAction(playerId, move);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = this.locationToString(move.unitDoingAction.turnStartLocation);
        const currentMoveAction = currentTurn[playerId][locationKey].moveAction;
        if (currentMoveAction) {
            currentMoveAction.targetedCoordinates = move.targetedCoordinates;
        }
        else {
            currentTurn[playerId][locationKey].moveAction = move;
        }
    }
    playerSpecial(playerId, special) {
        this.verifyPlayerAndAction(playerId, special);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = this.locationToString(special.unitDoingAction.turnStartLocation);
        currentTurn[playerId][locationKey].specialAction = special;
    }
    resetPlayerMoves(playerId) {
        const currentTurn = this.history[this.history.length - 1];
        currentTurn[playerId] = {};
    }
    saveAndGetTurnHistory() {
        const currentTurn = this.history[this.history.length - 1];
        this.history.push({});
        return currentTurn;
    }
    verifyPlayerAndAction(playerId, move) {
        const currentTurn = this.history[this.history.length - 1];
        const playerActions = currentTurn[playerId];
        const locationKey = this.locationToString(move.unitDoingAction.turnStartLocation);
        if (!playerActions) {
            currentTurn[playerId] = {
                [locationKey]: {
                    moveAction: null,
                    specialAction: null,
                },
            };
        }
        else if (!playerActions[locationKey]) {
            currentTurn[playerId][locationKey] = {
                moveAction: null,
                specialAction: null,
            };
        }
    }
    locationToString(location) {
        return `${location.x}, ${location.y}`;
    }
}
exports.default = MoveHistory;
//# sourceMappingURL=moveHistory.js.map