"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaserGameUnit_1 = __importDefault(require("./phaserGameUnit"));
class PhaserMainBaseUnit extends phaserGameUnit_1.default {
    constructor(scene, location, mainBaseUnit) {
        const isMine = mainBaseUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "mainbase" : "enemyMainbase", mainBaseUnit);
    }
}
exports.default = PhaserMainBaseUnit;
//# sourceMappingURL=phaserMainBaseUnit.js.map