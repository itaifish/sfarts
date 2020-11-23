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
const lobbyManager_1 = __importDefault(require("./lobbyManager"));
const gameManager_1 = __importDefault(require("../../shared/game/manager/gameManager"));
const mapManager_1 = __importDefault(require("../../shared/game/manager/mapManager"));
const logger_1 = __importStar(require("../../shared/utility/logger"));
class GamesManager extends lobbyManager_1.default {
    constructor(userManager) {
        super();
        this.userManager = userManager;
        this.lobbyToGameManagerMap = {};
    }
    lobbyToGame(lobby) {
        const lobbyLeader = this.userManager.getUserFromUserId(lobby.lobbyLeader);
        const createdGame = this.userCreateLobby(lobbyLeader, lobby.settings, lobby.id);
        lobby.players.forEach((playerId) => {
            const user = this.userManager.getUserFromUserId(playerId);
            const teamId = Object.keys(lobby.playerTeamMap).find((teamId) => {
                return lobby.playerTeamMap[parseInt(teamId)][playerId];
            });
            this.userJoinTeamInLobby(user, createdGame.id, parseInt(teamId));
        });
        this.lobbyToGameManagerMap[lobby.id] = new gameManager_1.default(lobby.id, lobbyLeader.id, lobby.players, mapManager_1.default.getMapFromId(lobby.settings.mapId, lobby.players));
        return this.lobbyToGameManagerMap[lobby.id];
    }
    addPlayerMove(playerId, move) {
        const gameManager = this.playerToGameManager(playerId);
        if (gameManager) {
            gameManager.addMovesForPlayer(playerId, [move]);
        }
        else {
            logger_1.default(`Unable to find game for player ${playerId} from games ${JSON.stringify(Object.values(this.lobbyToGameManagerMap).map((gameManager) => gameManager.playerIds))}`, this.constructor.name, logger_1.LOG_LEVEL.WARN);
            logger_1.default(`users lobby: ${this.usersToLobbyMap[playerId].id}`, this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
            logger_1.default(`game manager lobbies: ${JSON.stringify(Object.keys(this.lobbyToGameManagerMap))}`, this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
        }
    }
    addPlayerSpecial(playerId, special) {
        this.playerToGameManager(playerId).addSpecialsForPlayer(playerId, [special]);
    }
    playerSendsEndTurnSignal(playerId, endTurn) {
        var _a;
        (_a = this.playerToGameManager(playerId)) === null || _a === void 0 ? void 0 : _a.playerSendsEndTurnSignal(playerId, endTurn);
    }
    resetPlayerMoves(playerId) {
        var _a;
        return (_a = this.playerToGameManager(playerId)) === null || _a === void 0 ? void 0 : _a.resetPlayerMoves(playerId);
    }
    allPlayersHaveEndedTurn(gameId) {
        const gameManager = this.lobbyToGameManagerMap[gameId];
        return gameManager.allPlayersHaveEndedTurn();
    }
    endTurnAndGetGameState(gameId) {
        const gameManager = this.lobbyToGameManagerMap[gameId];
        gameManager.endTurn();
        return gameManager.boardState;
    }
    playerToGameManager(userId) {
        const lobbyFromPlayer = this.usersToLobbyMap[userId];
        return this.lobbyToGameManagerMap[lobbyFromPlayer.id];
    }
    gameOver(userIdOfLoser) {
        const lobbyFromPlayer = this.usersToLobbyMap[userIdOfLoser];
        if (lobbyFromPlayer) {
            const anyOtherPlayer = lobbyFromPlayer.players.find((playerId) => playerId != userIdOfLoser);
            delete this.lobbyToGameManagerMap[lobbyFromPlayer.id];
            this.deleteLobby(lobbyFromPlayer.id);
            return { winnerId: anyOtherPlayer, roomName: lobbyFromPlayer.getRoomName() };
        }
        return null;
    }
}
exports.default = GamesManager;
//# sourceMappingURL=gamesManager.js.map