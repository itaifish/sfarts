"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const gameBoard_1 = __importDefault(require("../gameBoard"));
const math_1 = __importDefault(require("../../../shared/utility/math"));
const fighter_png_1 = __importDefault(require("../../resources/images/fighter.png"));
const enemyfighter_png_1 = __importDefault(require("../../resources/images/enemyfighter.png"));
const speeder_png_1 = __importDefault(require("../../resources/images/speeder.png"));
const enemyspeeder_png_1 = __importDefault(require("../../resources/images/enemyspeeder.png"));
const destroyer_png_1 = __importDefault(require("../../resources/images/destroyer.png"));
const enemydestroyer_png_1 = __importDefault(require("../../resources/images/enemydestroyer.png"));
const mainbase_png_1 = __importDefault(require("../../resources/images/mainbase.png"));
const mainbaseenemy_png_1 = __importDefault(require("../../resources/images/mainbaseenemy.png"));
const phaserFighterUnit_1 = __importDefault(require("../units/phaserFighterUnit"));
const healthBar_1 = __importDefault(require("../gui/healthBar"));
const phaserSpeederUnit_1 = __importDefault(require("../units/phaserSpeederUnit"));
const speederUnit_1 = __importDefault(require("../../../shared/game/units/speederUnit"));
const fighterUnit_1 = __importDefault(require("../../../shared/game/units/fighterUnit"));
const destoyerUnit_1 = __importDefault(require("../../../shared/game/units/destoyerUnit"));
const phaserDestroyerUnit_1 = __importDefault(require("../units/phaserDestroyerUnit"));
const mainBaseUnit_1 = __importDefault(require("../../../shared/game/units/mainBaseUnit"));
const phaserMainBaseUnit_1 = __importDefault(require("../units/phaserMainBaseUnit"));
class GameScene extends phaser_1.default.Scene {
    constructor(width, height, client, gameManager) {
        const config = {
            active: false,
        };
        super(config);
        this.width = width;
        this.height = height;
        this.client = client;
        this.gameManager = null;
        this.rexBoard = null;
        this.loadBoardState = this.loadBoardState.bind(this);
        this.client.updateBoardStateCallback = this.loadBoardState;
        this.gameManager = gameManager;
        this.phaserGameUnitPool = [];
    }
    preload() {
        this.load.scenePlugin({
            key: "rexboardplugin",
            url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js",
            sceneKey: "rexBoard",
        });
        this.load.image("fighter", fighter_png_1.default);
        this.load.image("enemyFighter", enemyfighter_png_1.default);
        this.load.image("speeder", speeder_png_1.default);
        this.load.image("enemySpeeder", enemyspeeder_png_1.default);
        this.load.image("destroyer", destroyer_png_1.default);
        this.load.image("enemyDestroyer", enemydestroyer_png_1.default);
        this.load.image("mainbase", mainbase_png_1.default);
        this.load.image("enemyMainbase", mainbaseenemy_png_1.default);
    }
    create() {
        const config = {
            grid: this.getHexagonGrid(this),
            width: this.width,
            height: this.height,
            wrap: false,
        };
        this.board = new gameBoard_1.default(this, config);
        this.loadBoardState();
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
        this.cameraController.camera.setBounds(minXY.x, minXY.y, maxSize.x, maxSize.y + 300);
    }
    update(time, delta) {
        super.update(time, delta);
        this.cameraController.update(delta);
        this.cameraController.camera.setZoom(math_1.default.clamp(this.cameraController.camera.zoom, 3, 1));
    }
    loadBoardState() {
        this.board.removeAllChess(true);
        this.board.unSelect();
        this.phaserGameUnitPool.forEach((phaserGameUnit) => {
            phaserGameUnit.destroy();
        });
        this.phaserGameUnitPool = [];
        this.board.forEachTileXY((tileXY, board) => {
            const location = { x: tileXY.x, y: tileXY.y };
            const unit = this.gameManager.getUnitAt(location);
            if (unit) {
                const unitType = unit.name;
                const phaserUnit = unitType == fighterUnit_1.default.prototype.constructor.name
                    ? new phaserFighterUnit_1.default(this, location, unit)
                    : unitType == speederUnit_1.default.prototype.constructor.name
                        ? new phaserSpeederUnit_1.default(this, location, unit)
                        : unitType == destoyerUnit_1.default.prototype.constructor.name
                            ? new phaserDestroyerUnit_1.default(this, location, unit)
                            : unitType == mainBaseUnit_1.default.prototype.constructor.name
                                ? new phaserMainBaseUnit_1.default(this, location, unit)
                                : null;
                const unitHealthBar = new healthBar_1.default(this, phaserUnit);
                this.phaserGameUnitPool.push(phaserUnit);
                this.phaserGameUnitPool.push(unitHealthBar.bar);
            }
        }, this);
    }
    getHexagonGrid(scene) {
        const staggeraxis = "x";
        const staggerindex = "odd";
        const grid = scene.rexBoard.add.hexagonGrid({
            x: 60,
            y: 60,
            size: 60,
            staggeraxis: staggeraxis,
            staggerindex: staggerindex,
        });
        return grid;
    }
    static getSceneName() {
        return "GameScene";
    }
    getBoard() {
        return this.board;
    }
}
exports.default = GameScene;
//# sourceMappingURL=gameScene.js.map