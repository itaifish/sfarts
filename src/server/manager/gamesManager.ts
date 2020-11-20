import LobbyManger from "./lobbyManager";
import Lobby from "../room/lobby/lobby";
import UserManager, { User } from "./userManager";
import MoveAction from "../../shared/game/move/moveAction";
import GameManager from "../../shared/game/manager/gameManager";
import MapManager from "../../shared/game/manager/mapManager";
import SpecialAction from "../../shared/game/move/specialAction";
import GameUnit from "../../shared/game/units/gameUnit";

export default class GamesManager extends LobbyManger {
    private userManager: UserManager;

    lobbyToGameManagerMap: {
        [lobbyId: string]: GameManager;
    };

    constructor(userManager: UserManager) {
        super();
        this.userManager = userManager;
        this.lobbyToGameManagerMap = {};
    }

    lobbyToGame(lobby: Lobby) {
        const lobbyLeader = this.userManager.getUserFromUserId(lobby.lobbyLeader);
        const createdGame = this.userCreateLobby(lobbyLeader, lobby.settings);
        lobby.players.forEach((playerId) => {
            const user = this.userManager.getUserFromUserId(playerId);
            const teamId = Object.keys(lobby.playerTeamMap).find((teamId) => {
                return lobby.playerTeamMap[parseInt(teamId)][playerId];
            });
            this.userJoinTeamInLobby(user, createdGame.id, parseInt(teamId));
        });
        this.lobbyToGameManagerMap[lobby.id] = new GameManager(
            lobby.id,
            lobbyLeader.id,
            lobby.players,
            MapManager.getMapFromId(lobby.settings.mapId, lobby.players),
        );
    }

    addPlayerMove(playerId: number, move: MoveAction) {
        this.playerToGameManager(playerId).addMovesForPlayer(playerId, [move]);
    }

    addPlayerSpecial(playerId: number, special: SpecialAction) {
        this.playerToGameManager(playerId).addSpecialsForPlayer(playerId, [special]);
    }

    playerSendsEndTurnSignal(playerId: number, endTurn: boolean): void {
        this.playerToGameManager(playerId)?.playerSendsEndTurnSignal(playerId, endTurn);
    }

    allPlayersHaveEndedTurn(gameId: string): boolean {
        const gameManager = this.lobbyToGameManagerMap[gameId];
        return gameManager.allPlayersHaveEndedTurn();
    }

    endTurnAndGetGameState(gameId: string): GameUnit[][] {
        const gameManager = this.lobbyToGameManagerMap[gameId];
        gameManager.endTurn();
        return gameManager.boardState;
    }

    playerToGameManager(userId: number): GameManager {
        const lobbyFromPlayer = this.usersToLobbyMap[userId];
        return this.lobbyToGameManagerMap[lobbyFromPlayer.id];
    }
}
