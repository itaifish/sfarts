import GameUnit from "./gameUnit";
import unitStats from "./unitStats.json";
import { SpecialActionName } from "../move/specialAction";
import Location from "../location";

export default class DestroyerUnit extends GameUnit {
    constructor(controller: number, team: string, location: Location) {
        super(controller, team, unitStats.destroyer, [SpecialActionName.ATTACK], location, "DestroyerUnit");
    }
}
