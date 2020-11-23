"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const gameScene_1 = __importDefault(require("./scene/gameScene"));
/**
 * Class that represents the Turn-Based Science Fiction Action Real-Time Strategy Game (tbsfarts)
 */
class TbsfartsGame extends phaser_1.default.Game {
    constructor(client) {
        const config = {
            type: phaser_1.default.AUTO,
            width: 1600,
            height: 900,
            scale: {
                mode: phaser_1.default.Scale.FIT,
                autoCenter: phaser_1.default.Scale.CENTER_BOTH,
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
        this.scene.add(gameScene_1.default.getSceneName(), new gameScene_1.default(30, 30, client), true);
        // this.scene.add(LoginScreen.getSceneName(), new LoginScreen(client), false);
    }
}
exports.default = TbsfartsGame;
//# sourceMappingURL=tbsfartsGame.js.map