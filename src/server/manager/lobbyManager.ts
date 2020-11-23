import uuid4 from "uuid4";
import Lobby from "../room/lobby/lobby";
import LobbySettings from "../room/lobby/lobbySettings";
import { User } from "./userManager";
import { ClientLobby } from "../../shared/communication/messageInterfaces/lobbyMessage";

export default class LobbyManger {
    lobbyMap: { [lobbyId: string]: Lobby };

    usersToLobbyMap: { [userId: number]: Lobby };

    constructor() {
        this.lobbyMap = {};
        this.usersToLobbyMap = {};
    }

    getLobbyList(): ClientLobby[] {
        return Object.keys(this.lobbyMap).map((key: string) => this.lobbyMap[key].asClientLobby());
    }

    userCreateLobby(user: User, settings: LobbySettings, presetId?: string): Lobby {
        // disconnect user from any previous lobby they are in
        this.playerDisconnects(user);
        let id = presetId;
        if (!id) {
            do {
                id = uuid4();
            } while (this.lobbyMap[id] != null); // this should basically never happen, but just in case
        }
        const newLobby: Lobby = new Lobby(id, user, settings);
        this.usersToLobbyMap[user.id] = newLobby;
        this.lobbyMap[id] = newLobby;
        return newLobby;
    }

    userJoinTeamInLobby(user: User, lobbyId: string, teamId: number): Lobby {
        // disconnect user from any previous lobby they are in
        this.playerDisconnects(user);
        const lobby = this.lobbyMap[lobbyId];
        if (lobby) {
            const success = lobby.playerJoinTeam(user, teamId);
            if (success) {
                this.usersToLobbyMap[user.id] = lobby;
                return lobby;
            } else if (lobby.players.length == 0) {
                this.deleteLobby(lobby.id);
            }
        }
        return null;
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
        if (lobbyToDel) {
            delete this.lobbyMap[lobbyId];
            lobbyToDel.players.forEach((player) => {
                delete this.usersToLobbyMap[player];
            });
        }
    }
}
