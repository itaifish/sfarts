"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
class PhaserGameUnit extends phaser_1.default.GameObjects.Image {
    constructor(scene, x, y, texture, gameUnit) {
        super(scene, x, y, texture);
        this.gameUnit = gameUnit;
        scene.add.existing(this);
        scene.board.addChess(this, x, y, 1);
        this.moveTo = scene["rexBoard"].add.moveTo(this, {
            rotateToTarget: true,
            speed: gameUnit.unitStats.moveSpeed * 100,
        });
    }
    moveAlongPath(path) {
        if (path.length === 0) {
            this.emit("move.complete");
            return;
        }
        this.moveTo.once("complete", () => {
            this.moveAlongPath(path);
        }, this);
        this.moveTo.moveTo(path.shift());
        return this;
    }
}
exports.default = PhaserGameUnit;
//# sourceMappingURL=phaserGameUnit.js.map