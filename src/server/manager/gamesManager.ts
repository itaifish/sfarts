import LobbyManger from "./lobbyManager";
import Lobby from "../room/lobby/lobby";
import UserManager from "./userManager";
import MoveAction from "../../shared/game/move/moveAction";
import GameManager from "../../shared/game/manager/gameManager";
import MapManager from "../../shared/game/manager/mapManager";
import SpecialAction from "../../shared/game/move/specialAction";
import GameUnit from "../../shared/game/units/gameUnit";
import log, { LOG_LEVEL } from "../../shared/utility/logger";

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

    lobbyToGame(lobby: Lobby): GameManager {
        const lobbyLeader = this.userManager.getUserFromUserId(lobby.lobbyLeader);
        const createdGame = this.userCreateLobby(lobbyLeader, lobby.settings, lobby.id);
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
        return this.lobbyToGameManagerMap[lobby.id];
    }

    addPlayerMove(playerId: number, move: MoveAction) {
        const gameManager = this.playerToGameManager(playerId);
        if (gameManager) {
            gameManager.addMovesForPlayer(playerId, [move]);
        } else {
            log(
                `Unable to find game for player ${playerId} from games ${JSON.stringify(
                    Object.values(this.lobbyToGameManagerMap).map((gameManager) => gameManager.playerIds),
                )}`,
                this.constructor.name,
                LOG_LEVEL.WARN,
            );
            log(`users lobby: ${this.usersToLobbyMap[playerId].id}`, this.constructor.name, LOG_LEVEL.DEBUG);
            log(
                `game manager lobbies: ${JSON.stringify(Object.keys(this.lobbyToGameManagerMap))}`,
                this.constructor.name,
                LOG_LEVEL.DEBUG,
            );
        }
    }

    addPlayerSpecial(playerId: number, special: SpecialAction): void {
        this.playerToGameManager(playerId).addSpecialsForPlayer(playerId, [special]);
    }

    playerSendsEndTurnSignal(playerId: number, endTurn: boolean): void {
        this.playerToGameManager(playerId)?.playerSendsEndTurnSignal(playerId, endTurn);
    }

    resetPlayerMoves(playerId: number): GameUnit[][] {
        return this.playerToGameManager(playerId)?.resetPlayerMoves(playerId);
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
