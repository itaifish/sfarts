"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lobbyManager_1 = __importDefault(require("./lobbyManager"));
class GameManager extends lobbyManager_1.default {
    constructor(userManager) {
        super();
        this.userManager = userManager;
    }
    lobbyToGame(lobby) {
        const lobbyLeader = this.userManager.getUserFromUserId(lobby.lobbyLeader);
        const createdGame = this.userCreateLobby(lobbyLeader, lobby.settings);
        lobby.players.forEach((playerId) => {
            const user = this.userManager.getUserFromUserId(playerId);
            const teamId = Object.keys(lobby.playerTeamMap).find((teamId) => {
                return lobby.playerTeamMap[parseInt(teamId)][playerId];
            });
            this.userJoinTeamInLobby(user, createdGame.id, parseInt(teamId));
        });
    }
}
exports.default = GameManager;
//# sourceMappingURL=gameManager.js.map