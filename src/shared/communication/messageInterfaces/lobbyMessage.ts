import Lobby from "../../../server/room/lobby/lobby";
import LobbySettings from "../../../server/room/lobby/lobbySettings";

export interface GetLobbiesResponse {
    lobbies: Lobby[];
}

export interface LobbyResponse {
    lobby: Lobby;
}

export interface CreateLobbyRequest {
    lobbySettings: LobbySettings;
}

export interface JoinLobbyRequest {
    lobbyId: string;
    teamId: number;
}
