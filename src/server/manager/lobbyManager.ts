import Lobby from "../lobby/lobby";
import LobbySettings from "../lobby/lobbySettings";

export default class LobbyManger {
    lobbyMap: { [lobbyId: string]: Lobby };

    usersToLobbyMap: { [userId: string]: Lobby };

    constructor() {
        this.lobbyMap = {};
        this.lobbyMap = {};
    }

    userCreateLobby(user: User, settings: LobbySettings): void {}
}
