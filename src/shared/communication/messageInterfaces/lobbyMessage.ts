import LobbySettings from "../../../server/room/lobby/lobbySettings";

export interface ClientUser {
    username: string;
    id: number;
}

export interface ClientLobby {
    settings: LobbySettings;
    id: string;
    lobbyLeader: number;
    players: number[];
    playerTeamMap: {
        [teamId: number]: {
            [userId: number]: ClientUser;
        };
    };
}

export interface GetLobbiesResponse {
    lobbies: ClientLobby[];
}

export interface LobbyResponse {
    lobby: ClientLobby;
}

export interface CreateLobbyRequest {
    lobbySettings: LobbySettings;
}

export interface JoinLobbyRequest {
    lobbyId: string;
    teamId: number;
}
