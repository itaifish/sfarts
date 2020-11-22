import GameUnit from "./gameUnit";
import unitStats from "./unitStats.json";
import Location from "../location";

export default class MainBaseUnit extends GameUnit {
    constructor(controller: number, team: string, location: Location) {
        super(controller, team, unitStats.mainbase, [], location, "MainBaseUnit");
    }
}
