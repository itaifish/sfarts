"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaserGameUnit_1 = __importDefault(require("./phaserGameUnit"));
class PhaserSpeederUnit extends phaserGameUnit_1.default {
    constructor(scene, location, speederUnit) {
        const isMine = speederUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "speeder" : "enemySpeeder", speederUnit);
    }
}
exports.default = PhaserSpeederUnit;
//# sourceMappingURL=phaserSpeederUnit.js.map