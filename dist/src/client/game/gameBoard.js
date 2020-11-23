"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_components_1 = require("phaser3-rex-plugins/plugins/board-components");
const logger_1 = __importStar(require("../../shared/utility/logger"));
class GameBoard extends board_components_1.Board {
    constructor(scene, config) {
        // create board
        super(scene, config);
        this.scene = scene;
        this.selected = null;
        // draw grid
        this.selectedFillGraphics = scene.add.graphics({
            fillStyle: {
                color: 0x0071ff,
                alpha: 0.85,
            },
        });
        const gridGraphics = scene.add.graphics({
            lineStyle: {
                width: 2,
                color: 0x007ac1,
                alpha: 1,
            },
        });
        this.forEachTileXY(function (tileXY, board) {
            const points = board.getGridPoints(tileXY.x, tileXY.y, true);
            gridGraphics.strokePoints(points, true);
        });
        const size = this.getWorldSize();
        scene.add.renderTexture(0, 0, size.x, size.y).draw(gridGraphics).setDepth(-1);
        this.selectedRenderTexture = scene.add.renderTexture(0, 0, size.x, size.y);
        gridGraphics.destroy();
        this.setInteractive().on("tiledown", (pointer, tileXY) => {
            logger_1.default(`Clicked on tile ${tileXY.x},${tileXY.y}`, this.constructor.name, logger_1.LOG_LEVEL.TRACE);
            const unit = this.tileXYZToChess(tileXY.x, tileXY.y, 1);
            if (unit) {
                this.setSelected(tileXY);
            }
        });
        this.pathGraphics = scene.add.graphics({
            lineStyle: {
                width: 1,
                color: 0x007ac1,
                alpha: 1,
            },
        });
        this.pathTexture = scene.add.renderTexture(0, 0, size.x, size.y).setDepth(2);
        this.pathFinder = scene["rexBoard"].add.pathFinder({
            occupiedTest: true,
            pathMode: "A*",
        });
    }
    getWorldCameraOrigin() {
        return this.tileXYToWorldXY(-1, -1);
    }
    getWorldSize() {
        return this.tileXYToWorldXY(this.scene.width, this.scene.height);
    }
    setSelected(location) {
        this.selectedRenderTexture.clear();
        this.selectedFillGraphics.clear();
        this.selectedFillGraphics.fillPoints(this.getGridPoints(location.x, location.y, true), true);
        this.selectedRenderTexture.draw(this.selectedFillGraphics);
        this.selected = location;
    }
    clearPath() {
        this.pathTexture.clear();
        return this;
    }
    drawPath(tileXYArray) {
        this.pathGraphics.strokePoints(this.tileXYArrayToWorldXYArray(tileXYArray));
        this.pathTexture.clear().draw(this.pathGraphics);
        this.pathGraphics.clear();
        return this;
    }
    getPath(chess, endTileXY, out) {
        return this.pathFinder.setChess(chess).findPath(endTileXY, undefined, false, out);
    }
}
exports.default = GameBoard;
//# sourceMappingURL=gameBoard.js.map