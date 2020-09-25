import { User, UserStatus } from "../manager/userManager";
import LobbySettings from "./lobbySettings";

export default class Lobby {
    settings: LobbySettings;
    id: string;
    playerTeamMap: {
        [teamId: number]: {
            [userId: string]: User;
        };
    };

    constructor(settings: LobbySettings) {
        this.settings = settings;
        this.playerTeamMap = {};
        for (let i = 0; i < settings.numTeams; i++) {
            this.playerTeamMap[i] = {};
        }
    }

    /**
     * This function has a player join a lobby by joining one of the teams in the lobby
     * @param player User object for the player joining
     * @param teamId ID of the team to join
     */
    playerJoinTeam(player: User, teamId: number): void {
        // Have player leave before rejoining to prevent the same player in more than one slot
        this.playerLeaveLobby(player);
        const team = this.playerTeamMap[teamId];
        if (team) {
            if (Object.keys(team).length < this.settings.maxPlayersPerTeam) {
                team[player.id] = player;
                player.status = UserStatus.IN_LOBBY;
            }
        }
    }
    /**
     * This function removes a player from the lobby
     * @param player user who has left the lobby
     */
    playerLeaveLobby(player: User): void {
        for (const teamId of Object.keys(this.playerTeamMap)) {
            const possiblePlayer = this.playerTeamMap[parseInt(teamId)][player.id];
            if (possiblePlayer) {
                delete this.playerTeamMap[parseInt(teamId)][player.id];
                possiblePlayer.status = UserStatus.ONLINE;
                return;
            }
        }
    }
}
