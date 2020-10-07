import Phaser from "phaser";
import GameBoard from "../gameBoard";
import { Board, HexagonGrid, QuadGrid } from "phaser3-rex-plugins/plugins/board-components";

export default class GameScene extends Phaser.Scene {
    board: any;
    rexBoard: any;
    constructor() {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: true,
        };
        super(config);
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
            // grid: getQuadGrid(this),
            width: 20,
            height: 16,
            wrap: true,
        };
        this.board = new GameBoard(this, config);
        debugger;
        this.board.forEachTileXY((tileXY: any, board: any) => {
            const chess = this.board.add.shape(board, tileXY.x, tileXY.y, 0, Phaser.Math.Between(0, 0xffffff), 0.7);
            this.add.text(chess.x, chess.y, `${tileXY.x} , ${tileXY.y}`).setOrigin(0.5).setTint(0x0);
            console.log(`${tileXY.x} , ${tileXY.y}`);
        }, this);
    }

    getHexagonGrid(scene: GameScene) {
        const staggeraxis = "x";
        const staggerindex = "odd";
        const grid = scene.rexBoard.add.hexagonGrid({
            x: 50,
            y: 50,
            size: 20,
            staggeraxis: staggeraxis,
            staggerindex: staggerindex,
        });
        return grid;
    }

    static getSceneName(): string {
        return "GameScene";
    }
}
