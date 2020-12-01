import Phaser from "phaser";
import GameBoard, { ActionState } from "../gameBoard";
import MathUtility from "../../../shared/utility/math";
import PhaserFighterUnit from "../units/phaserFighterUnit";
import Client from "../../client";
import GameManager from "../../../shared/game/manager/gameManager";
import HealthBar from "../gui/healthBar";
import PhaserGameUnit from "../units/phaserGameUnit";
import PhaserSpeederUnit from "../units/phaserSpeederUnit";
import SpeederUnit from "../../../shared/game/units/speederUnit";
import FighterUnit from "../../../shared/game/units/fighterUnit";
import DestroyerUnit from "../../../shared/game/units/destoyerUnit";
import PhaserDestroyerUnit from "../units/phaserDestroyerUnit";
import MainBaseUnit from "../../../shared/game/units/mainBaseUnit";
import PhaserMainBaseUnit from "../units/phaserMainBaseUnit";
import { unitNameToTextureMap } from "../../../shared/game/units/unitStats";

export default class GameScene extends Phaser.Scene {
    board: any;
    rexBoard: any;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    width: number;
    height: number;
    client: Client;
    gameManager: GameManager;
    phaserGameUnitPool: Phaser.GameObjects.GameObject[];

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
        Object.keys(unitNameToTextureMap).forEach((unit: string) => {
            const textures = unitNameToTextureMap[unit];
            Object.keys(textures).forEach((textureName: "ally" | "enemy") => {
                const texture = textures[textureName];
                this.load.image(texture.name, texture.image);
            });
        });
    }

    create() {
        const config = {
            grid: this.getHexagonGrid(this),
            width: this.width,
            height: this.height,
            wrap: false,
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
        this.cameraController.camera.setBounds(minXY.x, minXY.y, maxSize.x, maxSize.y + 300);
    }

    update(time: number, delta: number) {
        super.update(time, delta);
        this.cameraController.update(delta);
        this.cameraController.camera.setZoom(MathUtility.clamp(this.cameraController.camera.zoom, 3, 1));
    }

    loadBoardState() {
        this.board.removeAllChess(true);
        this.board.unSelect();
        this.phaserGameUnitPool.forEach((phaserGameUnit) => {
            phaserGameUnit.destroy();
        });
        this.phaserGameUnitPool = [];
        this.board.forEachTileXY((tileXY: any, board: any) => {
            const location = { x: tileXY.x, y: tileXY.y };
            const unit = this.gameManager.getUnitAt(location);
            if (unit) {
                const unitType = unit.name;
                const phaserUnit: PhaserGameUnit =
                    unitType == FighterUnit.prototype.constructor.name
                        ? new PhaserFighterUnit(this, location, unit)
                        : unitType == SpeederUnit.prototype.constructor.name
                        ? new PhaserSpeederUnit(this, location, unit)
                        : unitType == DestroyerUnit.prototype.constructor.name
                        ? new PhaserDestroyerUnit(this, location, unit)
                        : unitType == MainBaseUnit.prototype.constructor.name
                        ? new PhaserMainBaseUnit(this, location, unit)
                        : null;
                const unitHealthBar: HealthBar = new HealthBar(this, phaserUnit);
                this.phaserGameUnitPool.push(phaserUnit);
                this.phaserGameUnitPool.push(unitHealthBar.bar);
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

    getBoard() {
        return this.board;
    }
}
