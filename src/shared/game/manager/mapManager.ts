import GameUnit from "../units/gameUnit";
import FighterUnit from "../units/fighterUnit";
import Location from "../location";

export default class MapManager {
    private static unitToString = {
        FighterUnit: "f",
        null: "n",
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    private static stringToUnitContructor: { [key: string]: Function | null } = {
        f: (controller: number, team: string, location: Location) => new FighterUnit(controller, team, location),
        n: null,
    };

    private static mapIdToString: { [key: string]: string } = {
        "1":
            "12 n n n n n n n n n n n n " +
            "f0 f0 f0 n n n n n n n n n " +
            "n n n n n n n n n f1 f1 f1 " +
            "n n n n n n n n n n n n " +
            "n n n n n n n n n n n n " +
            "n n n n n n n n n n n n " +
            "n n n n n n n n n n n n " +
            "n n n n n n n n n n n n " +
            "f0 f0 f0 n n n n n n n n n " +
            "n n n n n n n n n f1 f1 f1 " +
            "n n n n n n n n n n n n " +
            "n n n n n n n n n n n n ",
    };

    static getMapFromId(mapId: string, players: number[]): GameUnit[][] {
        return MapManager.mapStringToMap(MapManager.mapIdToString[mapId]);
    }

    static mapStringToMap(mapString: string): GameUnit[][] {
        const gameUnitArray: GameUnit[][] = [];
        let currentIndex = 0,
            endIndex = 0;
        endIndex = mapString.indexOf(" ");
        const gameSize = parseInt(mapString.substr(currentIndex, endIndex - currentIndex));
        currentIndex = endIndex + 1;
        for (let y = 0; y < gameSize; y++) {
            gameUnitArray.push([]);
            for (let x = 0; x < gameSize; x++) {
                endIndex = mapString.indexOf(" ", currentIndex);
                const fullUnitStr = mapString.substr(currentIndex, endIndex - currentIndex);
                const justNumbers = fullUnitStr.replace(/\D/g, "");
                const justLetters = fullUnitStr.replace(/[0-9]/g, "");
                const unitConstructor = MapManager.stringToUnitContructor[justLetters];
                if (unitConstructor) {
                    gameUnitArray[y].push(unitConstructor(justNumbers, justNumbers, { x: x, y: y }));
                } else {
                    gameUnitArray[y].push(null);
                }
                currentIndex = endIndex + 1;
            }
        }
        return gameUnitArray;
    }
}
