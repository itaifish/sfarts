"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
class LobbyScreen extends phaser_1.default.Scene {
    constructor(client) {
        const config = {
            active: true,
        };
        super(config);
        this.client = client;
        this.client.loadLobbyList(() => {
            this.lobbyList = this.client.lobbyList;
        });
    }
    preload() { }
    create() { }
    static getSceneName() {
        return "LobbyScreen";
    }
}
exports.default = LobbyScreen;
//# sourceMappingURL=lobbyScene.js.map