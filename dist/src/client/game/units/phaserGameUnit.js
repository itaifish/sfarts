"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
class PhaserGameUnit extends phaser_1.default.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
    }
}
exports.default = PhaserGameUnit;
//# sourceMappingURL=phaserGameUnit.js.map