import MoveAction from "./moveAction";
import SpecialAction from "./specialAction";

interface singleTurnMoveHistory {
    [playerId: string]: {
        [locationKey: string]: {
            moveAction: MoveAction;
            specialAction: SpecialAction;
        };
    };
}

export default class MoveHistory {
    history: singleTurnMoveHistory[];

    constructor(players: string[]) {
        this.history = [{}];
    }

    playerMove(playerId: string, move: MoveAction) {
        this.verifyPlayerAndAction(playerId, move);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = `${move.unitDoingAction.turnStartLocation}`;
        const currentMoveAction = currentTurn[playerId][locationKey].moveAction;
        if (currentMoveAction) {
            currentMoveAction.targetedCoordinates = move.targetedCoordinates;
        }
    }

    playerSpecial(playerId: string, special: SpecialAction) {
        this.verifyPlayerAndAction(playerId, special);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = `${special.unitDoingAction.turnStartLocation}`;
        currentTurn[playerId][locationKey].specialAction = special;
    }

    saveAndGetTurnHistory() {
        const currentTurn = this.history[this.history.length - 1];
        this.history.push({});
        return currentTurn;
    }

    private verifyPlayerAndAction(playerId: string, move: MoveAction | SpecialAction) {
        const currentTurn = this.history[this.history.length - 1];
        const playerActions = currentTurn[playerId];
        const locationKey = `${move.unitDoingAction.turnStartLocation}`;
        if (!playerActions) {
            currentTurn[playerId] = {
                [locationKey]: {
                    moveAction: null,
                    specialAction: null,
                },
            };
        } else if (!playerActions[locationKey]) {
            currentTurn[playerId][locationKey] = {
                moveAction: null,
                specialAction: null,
            };
        }
    }
}
