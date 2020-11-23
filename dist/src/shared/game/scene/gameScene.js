"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
const board_components_1 = require("phaser3-rex-plugins/plugins/board-components");
class GameScene extends phaser_1.Scene {
    constructor(_config) {
        const config = _config || {
            active: true,
        };
        super(config);
        const gridConfig = {
            grid: {
                gridType: "hexagonGrid",
                x: 0,
                y: 0,
                size: 30,
                staggeraxis: "x",
                staggerindex: "odd",
            },
            width: 500,
            height: 500,
        };
        this.board = new board_components_1.Board(gridConfig);
        debugger;
        this.board.forEachTileXY((tileXY, board) => {
            const chess = this.board.add.shape(this.board, tileXY.x, tileXY.y, 0, phaser_1.Math.Between(0, 0xffffff), 0.7);
            //this.add.text(chess.x, chess.y, `${tileXY.x}, ${tileXY.y}`).setOrigin(0.5);
        });
        this.add.existing(this.board);
    }
    static getSceneName() {
        return "GameScene";
    }
}
exports.default = GameScene;
//# sourceMappingURL=gameScene.js.map