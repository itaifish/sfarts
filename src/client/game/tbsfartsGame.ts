import Phaser from "phaser";
import GameScene from "./scene/gameScene";
import Client from "../client";
import UI from "./scene/ui";

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
        const height = client.gameManager.boardState.length;
        const width = client.gameManager.boardState[0].length;
        this.canvas.oncontextmenu = (e) => {
            e.preventDefault();
        };
        const gameScene = new GameScene(width, height, client, client.gameManager);
        this.scene.add(GameScene.getSceneName(), gameScene, true);
        this.scene.add("UI", new UI(30, 30, gameScene), true);
    }
}
