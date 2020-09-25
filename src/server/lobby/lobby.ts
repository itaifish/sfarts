import { User, UserStatus } from "../manager/userManager";
import LobbySettings from "./lobbySettings";

export default class Lobby {
    settings: LobbySettings;
    id: string;
    lobbyLeader: number;
    players: number[];
    playerTeamMap: {
        [teamId: number]: {
            [userId: number]: User;
        };
    };

    constructor(initialPlayer: User, settings: LobbySettings) {
        this.settings = settings;
        this.players = [];
        this.playerTeamMap = {};
        for (let i = 0; i < settings.numTeams; i++) {
            this.playerTeamMap[i] = {};
        }
        this.playerJoinTeam(initialPlayer, 0);
        this.lobbyLeader = initialPlayer.id;
    }

    /**
     * This function has a player join a lobby by joining one of the teams in the lobby
     * @param player User object for the player joining
     * @param teamId ID of the team to join
     */
    playerJoinTeam(player: User, teamId: number): void {
        // Have player leave before rejoining to prevent the same player in more than one slot
        // Save the lobby leader since having a player leave a lobby for real resets the lobby leader
        let lobbyLeaderSave = null;
        if (this.lobbyLeader == player.id) {
            lobbyLeaderSave = this.lobbyLeader;
        }
        this.playerLeaveLobby(player);
        if (lobbyLeaderSave) {
            this.lobbyLeader = lobbyLeaderSave;
        }
        const team = this.playerTeamMap[teamId];
        if (team) {
            if (Object.keys(team).length < this.settings.maxPlayersPerTeam) {
                team[player.id] = player;
                player.status = UserStatus.IN_LOBBY;
                this.players.push(player.id);
            }
        }
    }
    /**
     * This function removes a player from the lobby
     * @param playerLeaving user who has left the lobby
     */
    playerLeaveLobby(playerLeaving: User): void {
        // remove player leaving from list of players
        this.players = this.players.filter((playerId) => playerId != playerLeaving.id);
        for (const teamId of Object.keys(this.playerTeamMap)) {
            const possiblePlayer = this.playerTeamMap[parseInt(teamId)][playerLeaving.id];
            if (possiblePlayer) {
                delete this.playerTeamMap[parseInt(teamId)][playerLeaving.id];
                possiblePlayer.status = UserStatus.ONLINE;
                if (this.lobbyLeader == possiblePlayer.id) {
                    this.lobbyLeader = this.players[0] || null;
                }
                return;
            }
        }
    }
}
