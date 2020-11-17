import MoveAction from "./moveAction";
import SpecialAction from "./specialAction";

interface singleTurnMoveHistory {
    [playerId: string]: {
        moveActions: MoveAction[];
        specialActions: SpecialAction[];
    };
}

export default class MoveHistory {
    history: singleTurnMoveHistory[];

    constructor(players: string[]) {
        this.history = [{}];
    }

    playerMove(playerId: string, move: MoveAction) {
        this.verifyPlayer(playerId);
        const currentTurn = this.history[this.history.length - 1];
        currentTurn[playerId].moveActions.push(move);
    }

    playerSpecial(playerId: string, special: SpecialAction) {
        this.verifyPlayer(playerId);
        const currentTurn = this.history[this.history.length - 1];
        currentTurn[playerId].specialActions.push(special);
    }

    saveAndGetTurnHistory() {
        const currentTurn = this.history[this.history.length - 1];
        this.history.push({});
        return currentTurn;
    }

    private verifyPlayer(playerId: string) {
        const currentTurn = this.history[this.history.length - 1];
        if (!currentTurn[playerId]) {
            currentTurn[playerId] = {
                moveActions: [],
                specialActions: [],
            };
        }
    }
}
