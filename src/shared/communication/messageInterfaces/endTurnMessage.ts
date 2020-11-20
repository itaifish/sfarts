import GameUnit from "../../game/units/gameUnit";

export interface EndTurnRequest {
    playerHasEndedTurn: boolean;
}

export interface EndTurnResponse {
    gameState: GameUnit[][];
}
