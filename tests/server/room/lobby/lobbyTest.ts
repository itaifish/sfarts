import LobbyManger from "../../../../src/server/manager/lobbyManager";
import { User, UserStatus } from "../../../../src/server/manager/userManager";
import Lobby from "../../../../src/server/room/lobby/lobby";
import LobbySettings from "../../../../src/server/room/lobby/lobbySettings";

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
        const manager: LobbyManger = new LobbyManger();
        const lobby: Lobby = manager.userCreateLobby(user1, settings);
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
        manager.userJoinTeamInLobby(user2, lobby.id, 1);
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
        manager.playerDisconnects(user1);
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
        manager.userJoinTeamInLobby(user1, lobby.id, 1);
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
        manager.userJoinTeamInLobby(user3, lobby.id, 1);
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
        expect(JSON.stringify(manager.lobbyMap)).toBe(
            JSON.stringify({
                [lobby.id]: lobby,
            }),
        );
        expect(JSON.stringify(manager.usersToLobbyMap)).toBe(
            JSON.stringify({
                [user1.id]: lobby,
                [user2.id]: lobby,
            }),
        );
    });
});
