"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameUnit_1 = __importDefault(require("./gameUnit"));
const unitStats_json_1 = __importDefault(require("./unitStats.json"));
const specialAction_1 = require("../move/specialAction");
class SpeederUnit extends gameUnit_1.default {
    constructor(controller, team, location) {
        super(controller, team, unitStats_json_1.default.speeder, [specialAction_1.SpecialActionName.ATTACK], location, "SpeederUnit");
    }
}
exports.default = SpeederUnit;
//# sourceMappingURL=speederUnit.js.map