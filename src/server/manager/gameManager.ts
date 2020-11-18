import LobbyManger from "./lobbyManager";
import Lobby from "../room/lobby/lobby";
import UserManager from "./userManager";
import MoveHistory from "../../shared/game/move/moveHistory";

export default class GameManager extends LobbyManger {
    private userManager: UserManager;

    private gameHistory: MoveHistory;

    constructor(userManager: UserManager) {
        super();
        this.userManager = userManager;
    }

    lobbyToGame(lobby: Lobby) {
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
