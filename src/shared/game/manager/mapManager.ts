import GameUnit from "../units/gameUnit";
import FighterUnit from "../units/fighterUnit";

export default class MapManager {
    static getMapFromId(mapId: string, players: number[]): GameUnit[][] {
        const map = [];
        const size = 15;
        let playerIdx = 0;
        for (let y = 0; y < size; y++) {
            map.push([]);
            for (let x = 0; x < size; x++) {
                if ((x + y) % size == 0) {
                    map[y].push(new FighterUnit(players[playerIdx++] || 1, `${playerIdx + 1}`, { x: x, y: y }));
                }
            }
        }
        return map;
    }
}
