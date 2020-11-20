import { SpecialActionName } from "../move/specialAction";
import Location from "../location";
import UnitStats from "./unitStats";

export default class GameUnit {
    unitStats: UnitStats;
    controller: number;
    specialMoves: SpecialActionName[];
    location: Location;
    turnStartLocation: Location;
    team: string;

    constructor(
        controller: number,
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
        this.turnStartLocation = { x: location.x, y: location.y };
    }

    useMovesTo(moveAmount: number, location: Location): void {
        this.unitStats.movesRemaining -= moveAmount;
        this.location = { x: location.x, y: location.y };
    }

    processNewTurn() {
        this.turnStartLocation = { x: this.location.x, y: this.location.y };
        this.unitStats.movesRemaining = this.unitStats.moveSpeed;
    }
}
