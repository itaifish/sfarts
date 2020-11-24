"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userManager_1 = require("../../manager/userManager");
class Lobby {
    constructor(id, initialPlayer, settings) {
        this.settings = settings;
        this.players = [];
        this.playerTeamMap = {};
        this.id = id;
        for (let i = 0; i < settings.numTeams; i++) {
            this.playerTeamMap[i] = {};
        }
        this.playerJoinTeam(initialPlayer, 0);
        this.lobbyLeader = initialPlayer.id;
    }
    getRoomName() {
        return `${this.settings.lobbyName}: ${this.id}`;
    }
    /**
     * This function has a player join a lobby by joining one of the teams in the lobby
     * @param player User object for the player joining
     * @param teamId ID of the team to join
     * @returns whether or not the player was able to join
     */
    playerJoinTeam(player, teamId) {
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
                player.status = userManager_1.UserStatus.IN_LOBBY;
                this.players.push(player.id);
                return true;
            }
        }
        return false;
    }
    /**
     * This function removes a player from the lobby
     * @param playerLeaving user who has left the lobby
     */
    playerLeaveLobby(playerLeaving) {
        // remove player leaving from list of players
        this.players = this.players.filter((playerId) => playerId != playerLeaving.id);
        for (const teamId of Object.keys(this.playerTeamMap)) {
            const possiblePlayer = this.playerTeamMap[parseInt(teamId)][playerLeaving.id];
            if (possiblePlayer) {
                delete this.playerTeamMap[parseInt(teamId)][playerLeaving.id];
                possiblePlayer.status = userManager_1.UserStatus.ONLINE;
                if (this.lobbyLeader == possiblePlayer.id) {
                    this.lobbyLeader = this.players[0] || null;
                }
                return;
            }
        }
    }
    asClientLobby() {
        const playerTeamMap = {};
        Object.keys(this.playerTeamMap).forEach((teamId) => {
            const teamIdInt = parseInt(teamId);
            playerTeamMap[teamIdInt] = {};
            Object.keys(this.playerTeamMap[teamIdInt]).forEach((userId) => {
                const userIdInt = parseInt(userId);
                const user = this.playerTeamMap[teamIdInt][userIdInt];
                playerTeamMap[teamIdInt][userIdInt] = {
                    username: user.username,
                    id: user.id,
                };
            });
        });
        return {
            settings: this.settings,
            id: this.id,
            lobbyLeader: this.lobbyLeader,
            players: this.players,
            playerTeamMap: playerTeamMap,
        };
    }
}
exports.default = Lobby;
//# sourceMappingURL=lobby.js.map