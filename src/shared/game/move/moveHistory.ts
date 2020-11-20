import MoveAction from "./moveAction";
import SpecialAction from "./specialAction";
import Location from "../location";

interface singleTurnMoveHistory {
    [playerId: number]: {
        [locationKey: string]: {
            moveAction: MoveAction;
            specialAction: SpecialAction;
        };
    };
}

export default class MoveHistory {
    history: singleTurnMoveHistory[];

    constructor(players: number[]) {
        this.history = [{}];
    }

    playerMove(playerId: number, move: MoveAction) {
        this.verifyPlayerAndAction(playerId, move);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = this.locationToString(move.unitDoingAction.turnStartLocation);
        const currentMoveAction = currentTurn[playerId][locationKey].moveAction;
        if (currentMoveAction) {
            currentMoveAction.targetedCoordinates = move.targetedCoordinates;
        } else {
            currentTurn[playerId][locationKey].moveAction = move;
        }
    }

    playerSpecial(playerId: number, special: SpecialAction) {
        this.verifyPlayerAndAction(playerId, special);
        const currentTurn = this.history[this.history.length - 1];
        const locationKey = this.locationToString(special.unitDoingAction.turnStartLocation);
        currentTurn[playerId][locationKey].specialAction = special;
    }

    saveAndGetTurnHistory() {
        const currentTurn = this.history[this.history.length - 1];
        this.history.push({});
        return currentTurn;
    }

    private verifyPlayerAndAction(playerId: number, move: MoveAction | SpecialAction) {
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
        } else if (!playerActions[locationKey]) {
            currentTurn[playerId][locationKey] = {
                moveAction: null,
                specialAction: null,
            };
        }
    }

    private locationToString(location: Location): string {
        return `${location.x}, ${location.y}`;
    }
}
