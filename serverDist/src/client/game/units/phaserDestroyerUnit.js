"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaserGameUnit_1 = __importDefault(require("./phaserGameUnit"));
class PhaserDestroyerUnit extends phaserGameUnit_1.default {
    constructor(scene, location, destroyerUnit) {
        const isMine = destroyerUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "destroyer" : "enemyDestroyer", destroyerUnit);
    }
}
exports.default = PhaserDestroyerUnit;
//# sourceMappingURL=phaserDestroyerUnit.js.map