"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const gameBoard_1 = __importDefault(require("../gameBoard"));
const math_1 = __importDefault(require("../../../shared/utility/math"));
const fighter_png_1 = __importDefault(require("../../resources/images/fighter.png"));
const phaserFighterUnit_1 = __importDefault(require("../units/phaserFighterUnit"));
class GameScene extends phaser_1.default.Scene {
    constructor(width, height, client) {
        const config = {
            active: false,
        };
        super(config);
        this.width = width;
        this.height = height;
        this.client = client;
        this.rexBoard = null;
    }
    preload() {
        this.load.scenePlugin({
            key: "rexboardplugin",
            url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js",
            sceneKey: "rexBoard",
        });
        this.load.image("fighter", fighter_png_1.default);
    }
    create() {
        const config = {
            grid: this.getHexagonGrid(this),
            width: this.width,
            height: this.height,
            wrap: true,
        };
        this.board = new gameBoard_1.default(this, config);
        this.board.forEachTileXY((tileXY, board) => {
            const location = { x: tileXY.x, y: tileXY.y };
            if (Math.random() < 0.15) {
                const unit = new phaserFighterUnit_1.default(this, location);
                this.add.existing(unit);
                this.board.addChess(unit, location.x, location.y, 1);
            }
        }, this);
        const cursors = this.input.keyboard.createCursorKeys();
        this.cameraController = new phaser_1.default.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.MINUS),
            zoomOut: this.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.PLUS),
            acceleration: 0.09,
            drag: 0.003,
            maxSpeed: 0.5,
        });
        const maxSize = this.board.getWorldSize();
        const minXY = this.board.getWorldCameraOrigin();
        this.cameraController.camera.setBounds(minXY.x, minXY.y, maxSize.x, maxSize.y);
    }
    update(time, delta) {
        super.update(time, delta);
        this.cameraController.update(delta);
        this.cameraController.camera.setZoom(math_1.default.clamp(this.cameraController.camera.zoom, 3, 1));
    }
    getHexagonGrid(scene) {
        const staggeraxis = "x";
        const staggerindex = "odd";
        const grid = scene.rexBoard.add.hexagonGrid({
            x: 40,
            y: 40,
            size: 40,
            staggeraxis: staggeraxis,
            staggerindex: staggerindex,
        });
        return grid;
    }
    static getSceneName() {
        return "GameScene";
    }
}
exports.default = GameScene;
//# sourceMappingURL=gameScene.js.map