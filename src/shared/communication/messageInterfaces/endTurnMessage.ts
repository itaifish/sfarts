import GameUnit from "../../game/units/gameUnit";

export interface EndTurnRequest {
    playerHasEndedTurn: boolean;
}

export interface GameStateResponse {
    gameState: GameUnit[][];
    gameId?: string;
}
