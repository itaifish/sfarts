import Phaser from "phaser";
import Client from "../../client";
import Lobby from "../../../server/room/lobby/lobby";

export default class LobbyScreen extends Phaser.Scene {
    client: Client;

    lobbyList: Lobby[];

    constructor(client: Client) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: true,
        };
        super(config);
        this.client = client;
        this.client.loadLobbyList(() => {
            this.lobbyList = this.client.lobbyList;
        });
    }

    preload(): void {}

    create(): void {}

    static getSceneName(): string {
        return "LobbyScreen";
    }
}
