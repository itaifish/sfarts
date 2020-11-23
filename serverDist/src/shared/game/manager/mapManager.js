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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fighterUnit_1 = __importDefault(require("../units/fighterUnit"));
const logger_1 = __importStar(require("../../utility/logger"));
const speederUnit_1 = __importDefault(require("../units/speederUnit"));
const destoyerUnit_1 = __importDefault(require("../units/destoyerUnit"));
const mainBaseUnit_1 = __importDefault(require("../units/mainBaseUnit"));
class MapManager {
    static getMaps() {
        return [
            {
                id: "1",
                name: "Faceoff",
            },
            {
                id: "2",
                name: "Edgeworld",
            },
        ];
    }
    static getMapFromId(mapId, players) {
        return MapManager.mapStringToMap(MapManager.mapIdToString[mapId]);
    }
    static mapStringToMap(mapString) {
        const gameUnitArray = [];
        let currentIndex = 0, endIndex;
        endIndex = mapString.indexOf(" ", currentIndex);
        const gameWidth = parseInt(mapString.substr(currentIndex, endIndex - currentIndex));
        currentIndex = endIndex + 1;
        endIndex = mapString.indexOf(" ", currentIndex);
        const gameHeight = parseInt(mapString.substr(currentIndex, endIndex - currentIndex));
        currentIndex = endIndex + 1;
        for (let y = 0; y < gameHeight; y++) {
            gameUnitArray.push([]);
            for (let x = 0; x < gameWidth; x++) {
                endIndex = mapString.indexOf(" ", currentIndex);
                const fullUnitStr = mapString.substr(currentIndex, endIndex - currentIndex);
                const justNumbers = fullUnitStr.replace(/\D/g, "");
                const justLetters = fullUnitStr.replace(/[0-9]/g, "");
                const unitConstructor = MapManager.stringToUnitContructor[justLetters];
                if (unitConstructor) {
                    gameUnitArray[y].push(unitConstructor(parseInt(justNumbers), justNumbers, { x: x, y: y }));
                }
                else {
                    gameUnitArray[y].push(null);
                }
                currentIndex = endIndex + 1;
            }
        }
        logger_1.default(JSON.stringify(gameUnitArray), this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
        return gameUnitArray;
    }
}
exports.default = MapManager;
MapManager.unitToString = {
    FighterUnit: "f",
    null: "n",
};
// eslint-disable-next-line @typescript-eslint/ban-types
MapManager.stringToUnitContructor = {
    f: (controller, team, location) => new fighterUnit_1.default(controller, team, location),
    s: (controller, team, location) => new speederUnit_1.default(controller, team, location),
    d: (controller, team, location) => new destoyerUnit_1.default(controller, team, location),
    b: (controller, team, location) => new mainBaseUnit_1.default(controller, team, location),
    n: null,
};
MapManager.mapIdToString = {
    "1": "15 8 " +
        "n n n n n n n n n n n n n n n " +
        "f0 s0 f0 n n n n n n n n n n n n " +
        "n n n n n n n n n f1 s1 f1 n n n " +
        "b0 n n d0 n n n n n n d1 n n n b1 " +
        "n n n n n n n n n n n n n n n " +
        "f0 s0 f0 n n n n n n n n n n n n " +
        "n n n n n n n n n f1 s1 f1 n n n " +
        "n n n n n n n n n n n n n n n ",
    "2": "20 15 " +
        "n n n n n n n n n n n n n n n n n n n d0 " +
        "n b0 n s0 s0 n n n n n n n n n n n n n n n " +
        "n n n d0 n n n n n n n n n n n n n n n n " +
        "n n s0 n n n n n n n n n n n n n n n n n " +
        "n s0 n n f0 n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n n n n n n n " +
        "n n n n n n n n n n n n n n f1 n n n n s1 " +
        "n n n n n n n n n n n n n n n n n n s1 n " +
        "n n n n n n n n n n n n n n n n n d1 n n " +
        "n n n n n n n n n n n n f1 n n s1 s1 n b1 n " +
        "d1 n n n n n n n n n n n n n n n n n n n ",
};
//# sourceMappingURL=mapManager.js.map