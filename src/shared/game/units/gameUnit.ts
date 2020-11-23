import { SpecialActionName } from "../move/specialAction";
import Location from "../location";
import UnitStats, { copyStats } from "./unitStats";

export default class GameUnit {
    unitStats: UnitStats;
    controller: number;
    specialMoves: SpecialActionName[];
    specialsUsed: SpecialActionName[];
    location: Location;
    turnStartLocation: Location;
    team: string;
    name: string;

    constructor(
        controller: number,
        team: string,
        unitStats: UnitStats,
        specialMoves: SpecialActionName[],
        location: Location,
        name: string,
    ) {
        this.unitStats = copyStats(unitStats);
        this.controller = controller;
        this.team = team;
        this.specialMoves = specialMoves;
        this.specialsUsed = [];
        this.location = location;
        this.turnStartLocation = { x: location.x, y: location.y };
        this.name = name;
    }

    useSpecialAction(special: SpecialActionName) {
        this.specialsUsed.push(special);
    }

    canUseSpecial(special: SpecialActionName) {
        return !this.specialsUsed.includes(special);
    }

    useMovesTo(moveAmount: number, location: Location): void {
        this.unitStats.movesRemaining -= moveAmount;
        this.location = { x: location.x, y: location.y };
    }

    processNewTurn() {
        this.turnStartLocation = { x: this.location.x, y: this.location.y };
        this.unitStats.movesRemaining = this.unitStats.moveSpeed;
        this.specialsUsed = [];
    }
}
