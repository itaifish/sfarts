import { User, UserStatus } from "../../../src/server/manager/userManager";
import Lobby from "../../../src/server/lobby/lobby";
import LobbySettings from "../../../src/server/lobby/lobbySettings";

describe("lobby", () => {
    test("playerJoinTeam & playerLeaveLobby", () => {
        const settings: LobbySettings = {
            maxPlayersPerTeam: 2,
            numTeams: 2,
            turnTime: 30,
            lobbyName: "testLobby",
            mapId: "111111111111111",
        };
        const user1: User = {
            username: "test",
            password: "test",
            status: UserStatus.ONLINE,
            id: 0,
        };
        const user2: User = {
            username: "test",
            password: "test",
            status: UserStatus.ONLINE,
            id: 1,
        };
        const user3: User = {
            username: "test",
            password: "test",
            status: UserStatus.ONLINE,
            id: 2,
        };
        const lobby: Lobby = new Lobby(user1, settings);
        expect(JSON.stringify(lobby.playerTeamMap)).toBe(
            JSON.stringify({
                "0": {
                    "0": user1,
                },
                "1": {},
            }),
        );
        expect(lobby.lobbyLeader).toBe(0);
        expect(lobby.players.length).toBe(1);
        expect(user1.status).toBe(UserStatus.IN_LOBBY);
        lobby.playerJoinTeam(user2, 1);
        expect(JSON.stringify(lobby.playerTeamMap)).toBe(
            JSON.stringify({
                "0": {
                    "0": user1,
                },
                "1": {
                    "1": user2,
                },
            }),
        );
        expect(lobby.lobbyLeader).toBe(0);
        expect(lobby.players.length).toBe(2);
        lobby.playerLeaveLobby(user1);
        expect(JSON.stringify(lobby.playerTeamMap)).toBe(
            JSON.stringify({
                "0": {},
                "1": {
                    "1": user2,
                },
            }),
        );
        expect(user1.status).toBe(UserStatus.ONLINE);
        expect(lobby.lobbyLeader).toBe(1);
        expect(lobby.players.length).toBe(1);
        lobby.playerJoinTeam(user1, 1);
        expect(JSON.stringify(lobby.playerTeamMap)).toBe(
            JSON.stringify({
                "0": {},
                "1": {
                    "1": user2,
                    "0": user1,
                },
            }),
        );
        expect(user1.status).toBe(UserStatus.IN_LOBBY);
        expect(lobby.lobbyLeader).toBe(1);
        expect(lobby.players.length).toBe(2);
        lobby.playerJoinTeam(user3, 1);
        // this should fail as team is full
        expect(JSON.stringify(lobby.playerTeamMap)).toBe(
            JSON.stringify({
                "0": {},
                "1": {
                    "1": user2,
                    "0": user1,
                },
            }),
        );
        expect(user3.status).toBe(UserStatus.ONLINE);
        expect(lobby.lobbyLeader).toBe(1);
        expect(lobby.players.length).toBe(2);
    });
});
