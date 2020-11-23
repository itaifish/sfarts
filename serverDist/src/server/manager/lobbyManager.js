"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid4_1 = __importDefault(require("uuid4"));
const lobby_1 = __importDefault(require("../room/lobby/lobby"));
class LobbyManger {
    constructor() {
        this.lobbyMap = {};
        this.usersToLobbyMap = {};
    }
    getLobbyList() {
        return Object.keys(this.lobbyMap).map((key) => this.lobbyMap[key].asClientLobby());
    }
    userCreateLobby(user, settings, presetId) {
        // disconnect user from any previous lobby they are in
        this.playerDisconnects(user);
        let id = presetId;
        if (!id) {
            do {
                id = uuid4_1.default();
            } while (this.lobbyMap[id] != null); // this should basically never happen, but just in case
        }
        const newLobby = new lobby_1.default(id, user, settings);
        this.usersToLobbyMap[user.id] = newLobby;
        this.lobbyMap[id] = newLobby;
        return newLobby;
    }
    userJoinTeamInLobby(user, lobbyId, teamId) {
        // disconnect user from any previous lobby they are in
        const lobby = this.lobbyMap[lobbyId];
        if (lobby) {
            const success = lobby.playerJoinTeam(user, teamId);
            if (success) {
                this.usersToLobbyMap[user.id] = lobby;
                return lobby;
            }
            else if (lobby.players.length == 0) {
                this.deleteLobby(lobby.id);
            }
        }
        return null;
    }
    playerDisconnects(user) {
        const lobby = this.usersToLobbyMap[user.id];
        if (lobby) {
            lobby.playerLeaveLobby(user);
            if (lobby.players.length == 0) {
                this.deleteLobby(lobby.id);
            }
        }
    }
    deleteLobby(lobbyId) {
        const lobbyToDel = this.lobbyMap[lobbyId];
        if (lobbyToDel) {
            delete this.lobbyMap[lobbyId];
            lobbyToDel.players.forEach((player) => {
                delete this.usersToLobbyMap[player];
            });
        }
    }
}
exports.default = LobbyManger;
//# sourceMappingURL=lobbyManager.js.map