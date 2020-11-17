import { SpecialActionName } from "../move/specialAction";
import Location from "../location";
import location from "../location";
import UnitStats from "./unitStats";

export default class GameUnit {
    unitStats: UnitStats;
    controller: string;
    specialMoves: SpecialActionName[];
    location: location;
    team: string;

    constructor(
        controller: string,
        team: string,
        unitStats: UnitStats,
        specialMoves: SpecialActionName[],
        location: Location,
    ) {
        this.unitStats = unitStats;
        this.controller = controller;
        this.team = team;
        this.specialMoves = specialMoves;
        this.location = location;
    }
}
