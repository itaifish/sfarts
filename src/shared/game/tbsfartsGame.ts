import Phaser from "phaser";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-components";
import GameScene from "./scene/gameScene";

import LoginScreen from "./scene/loginScreen";

/**
 * Class that represents the Turn-Based Science Fiction Action Real-Time Strategy Game (tbsfarts)
 */
export default class TbsfartsGame extends Phaser.Game {
    constructor() {
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
        this.scene.add(GameScene.getSceneName(), new GameScene(), true);
        // this.scene.add(LoginScreen.getSceneName(), new LoginScreen(), true);
    }
}
