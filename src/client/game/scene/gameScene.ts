import Phaser from "phaser";
import GameBoard from "../gameBoard";
import MathUtility from "../../../shared/utility/math";
import { Board, HexagonGrid, QuadGrid, add } from "phaser3-rex-plugins/plugins/board-components";

export default class GameScene extends Phaser.Scene {
    board: any;
    rexBoard: any;
    cameraController: Phaser.Cameras.Controls.SmoothedKeyControl;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: true,
        };
        super(config);
        this.width = width;
        this.height = height;
        this.rexBoard = null;
    }

    preload() {
        this.load.scenePlugin({
            key: "rexboardplugin",
            url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js",
            sceneKey: "rexBoard",
        });
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
            // const chess = this.rexBoard.add.shape(board, tileXY.x, tileXY.y, 0, Phaser.Math.Between(0, 0xffffff), 0.7);
            const chess = this.board.tileXYToWorldXY(tileXY.x, tileXY.y);
            this.add.text(chess.x, chess.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5).setTint(0x0).setColor("white");
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
        const maxSize = this.getWorldSize();
        this.cameraController.camera.setBounds(0, 0, maxSize.x, maxSize.y);
    }

    getWorldSize(): { x: number; y: number } {
        return this.board.tileXYToWorldXY(this.width - 1, this.height - 1);
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
            x: 0,
            y: 0,
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
