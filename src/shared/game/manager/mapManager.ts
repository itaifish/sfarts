import GameUnit from "../units/gameUnit";
import FighterUnit from "../units/fighterUnit";
import Location from "../location";
import log, { LOG_LEVEL } from "../../utility/logger";
import SpeederUnit from "../units/speederUnit";
import DestroyerUnit from "../units/destoyerUnit";
import MainBaseUnit from "../units/mainBaseUnit";
import MedfighterUnit from "../units/medfighterUnit";

export default class MapManager {
    private static unitToString = {
        [FighterUnit.prototype.constructor.name]: "f",
        [SpeederUnit.prototype.constructor.name]: "s",
        [DestroyerUnit.prototype.constructor.name]: "d",
        [MainBaseUnit.prototype.constructor.name]: "b",
        [MedfighterUnit.prototype.constructor.name]: "m",
        null: "n",
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    private static stringToUnitContructor: {
        [key: string]: (controller: number, team: string, location: Location) => GameUnit | null;
    } = {
        f: (controller: number, team: string, location: Location) => new FighterUnit(controller, team, location),
        s: (controller: number, team: string, location: Location) => new SpeederUnit(controller, team, location),
        d: (controller: number, team: string, location: Location) => new DestroyerUnit(controller, team, location),
        b: (controller: number, team: string, location: Location) => new MainBaseUnit(controller, team, location),
        m: (controller: number, team: string, location: Location) => new MedfighterUnit(controller, team, location),
        n: null,
    };

    private static mapIdToString: { [key: string]: string } = {
        "1":
            "15 8 " +
            "n n n n n n n n n n n n n n n " +
            "f0 s0 f0 n n n n n n n n n n n n " +
            "n n n n n n n n n f1 s1 f1 n n n " +
            "b0 m0 n d0 n n n n n n d1 n n m1 b1 " +
            "n n n n n n n n n n n n n n n " +
            "f0 s0 f0 n n n n n n n n n n n n " +
            "n n n n n n n n n f1 s1 f1 n n n " +
            "n n n n n n n n n n n n n n n ",
        "2":
            "20 15 " +
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

    static getMapFromId(mapId: string, players: number[]): GameUnit[][] {
        return MapManager.mapStringToMap(MapManager.mapIdToString[mapId], players);
    }

    static mapStringToMap(mapString: string, players: number[]): GameUnit[][] {
        const gameUnitArray: GameUnit[][] = [];
        let currentIndex = 0,
            endIndex: number;
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
                    gameUnitArray[y].push(unitConstructor(players[parseInt(justNumbers)], justNumbers, { x: x, y: y }));
                } else {
                    gameUnitArray[y].push(null);
                }
                currentIndex = endIndex + 1;
            }
        }
        log(JSON.stringify(gameUnitArray), this.constructor.name, LOG_LEVEL.DEBUG);
        return gameUnitArray;
    }

    static mapToMapString(map: GameUnit[][]): string {
        let mapStr = `${map[0].length} ${map.length} `;
        const unitIds: number[] = [];
        map.forEach((rowY) => {
            rowY.forEach((unit) => {
                if (unit) {
                    let index = unitIds.findIndex((unitId) => unitId == unit.controller);
                    if (index == -1) {
                        index = unitIds.push(unit.controller) - 1;
                    }
                    mapStr += `${this.unitToString[unit?.name]}${index} `;
                } else {
                    mapStr += "n ";
                }
            });
        });
        return mapStr;
    }
}
