import uuid4 from "uuid4";
import Lobby from "../room/lobby/lobby";
import LobbySettings from "../room/lobby/lobbySettings";
import { User } from "./userManager";

export default class LobbyManger {
    lobbyMap: { [lobbyId: string]: Lobby };

    usersToLobbyMap: { [userId: number]: Lobby };

    constructor() {
        this.lobbyMap = {};
        this.usersToLobbyMap = {};
    }

    userCreateLobby(user: User, settings: LobbySettings): Lobby {
        let id;
        do {
            id = uuid4();
        } while (this.lobbyMap[id]); // this should basically never happen, but just in case
        const newLobby: Lobby = new Lobby(id, user, settings);
        this.usersToLobbyMap[user.id] = newLobby;
        this.lobbyMap[id] = newLobby;
        return newLobby;
    }

    userJoinTeamInLobby(user: User, lobbyId: string, teamId: number): void {
        const lobby = this.lobbyMap[lobbyId];
        if (lobby) {
            if (lobby.playerJoinTeam(user, teamId)) {
                this.usersToLobbyMap[user.id] = lobby;
            }
        }
    }

    playerDisconnects(user: User): void {
        const lobby = this.usersToLobbyMap[user.id];
        if (lobby) {
            lobby.playerLeaveLobby(user);
            if (lobby.players.length == 0) {
                this.deleteLobby(lobby.id);
            }
        }
    }

    deleteLobby(lobbyId: string): void {
        const lobbyToDel = this.lobbyMap[lobbyId];
        delete this.lobbyMap[lobbyId];
        lobbyToDel.players.forEach((player) => {
            delete this.usersToLobbyMap[player];
        });
    }
}
