import Phaser from "phaser";
import GameScene from "./scene/gameScene";

import LoginScreen from "./scene/loginScreen";
import Client from "../client";

/**
 * Class that represents the Turn-Based Science Fiction Action Real-Time Strategy Game (tbsfarts)
 */
export default class TbsfartsGame extends Phaser.Game {
    client: Client;

    constructor(client: Client) {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1600,
            height: 900,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            parent: "divId",
            dom: {
                createContainer: true,
            },
            physics: {
                default: "arcade",
            },
        };
        super(config);
        this.client = client;
        this.scene.add(LoginScreen.getSceneName(), new LoginScreen(client), true);
        this.scene.add(GameScene.getSceneName(), new GameScene(30, 30, client), false);
    }
}
