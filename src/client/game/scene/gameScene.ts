import Phaser from "phaser";
import GameBoard from "../gameBoard";
import MathUtility from "../../../shared/utility/math";
import Fighter from "../../resources/images/fighter.png";
import PhaserFighterUnit from "../units/phaserFighterUnit";
import Client from "../../client";

export default class GameScene extends Phaser.Scene {
    board: any;
    rexBoard: any;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    width: number;
    height: number;
    client: Client;

    constructor(width: number, height: number, client: Client) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
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
        this.load.image("fighter", Fighter);
    }

    create() {
        const config = {
            grid: this.getHexagonGrid(this),
            width: this.width,
            height: this.height,
            wrap: true,
        };
        this.board = new GameBoard(this, config);
        this.board.forEachTileXY((tileXY: any, board: any) => {
            const location = { x: tileXY.x, y: tileXY.y };
            if (Math.random() < 0.15) {
                const unit: PhaserFighterUnit = new PhaserFighterUnit(this, location);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.add.existing(unit);
                this.board.addChess(unit, location.x, location.y, 1);
            }
        }, this);

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

    getHexagonGrid(scene: GameScene) {
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

    static getSceneName(): string {
        return "GameScene";
    }
}
