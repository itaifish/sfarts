"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaserGameUnit_1 = __importDefault(require("./phaserGameUnit"));
class PhaserFighterUnit extends phaserGameUnit_1.default {
    constructor(scene, location) {
        super(scene, location.x, location.y, "fighter");
    }
}
exports.default = PhaserFighterUnit;
//# sourceMappingURL=phaserFighterUnit.js.map