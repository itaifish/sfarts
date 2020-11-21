import Phaser from "phaser";
import GameBoard, { ActionState } from "../gameBoard";
import MathUtility from "../../../shared/utility/math";
import Fighter from "../../resources/images/fighter.png";
import EnemyFighter from "../../resources/images/enemyfighter.png";
import PhaserFighterUnit from "../units/phaserFighterUnit";
import Client from "../../client";
import GameManager from "../../../shared/game/manager/gameManager";
import PhaserGameUnit from "../units/phaserGameUnit";

export default class GameScene extends Phaser.Scene {
    board: any;
    rexBoard: any;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    width: number;
    height: number;
    client: Client;
    gameManager: GameManager;
    phaserGameUnitPool: PhaserGameUnit[];

    constructor(width: number, height: number, client: Client, gameManager: GameManager) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
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
        this.load.image("fighter", Fighter);
        this.load.image("enemyFighter", EnemyFighter);
    }

    create() {
        const config = {
            grid: this.getHexagonGrid(this),
            width: this.width,
            height: this.height,
            wrap: true,
        };
        this.board = new GameBoard(this, config);
        this.loadBoardState();

        const cursors = this.input.keyboard.createCursorKeys();
        this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
            camera: this.cameras.main,

            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),

            acceleration: 0.09,
            drag: 0.003,
            maxSpeed: 0.5,
        });
        const maxSize = this.board.getWorldSize();
        const minXY = this.board.getWorldCameraOrigin();
        this.cameraController.camera.setBounds(minXY.x, minXY.y, maxSize.x, maxSize.y);
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.cameraController.update(delta);
        this.cameraController.camera.setZoom(MathUtility.clamp(this.cameraController.camera.zoom, 3, 1));
    }

    loadBoardState() {
        this.board.removeAllChess(true);
        this.board.selected = null;
        this.board.state = ActionState.IDLE;
        this.board.moveTo = { x: 0, y: 0 };
        this.phaserGameUnitPool.forEach((phaserGameUnit) => {
            phaserGameUnit.destroy();
        });
        this.phaserGameUnitPool = [];
        this.board.forEachTileXY((tileXY: any, board: any) => {
            const location = { x: tileXY.x, y: tileXY.y };
            const unit = this.gameManager.getUnitAt(location);
            if (unit) {
                const phaserUnit: PhaserFighterUnit = new PhaserFighterUnit(this, location, unit);
                this.phaserGameUnitPool.push(phaserUnit);
            }
        }, this);
    }

    getHexagonGrid(scene: GameScene) {
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

    static getSceneName(): string {
        return "GameScene";
    }
}
