import SpecialMove from "./move/specialMove";
import Location from "./location";
import location from "./location";

export default class GameUnit {
    moveSpeed: number;
    controller: string;
    specialMoves: SpecialMove[];
    location: location;

    constructor(controller: string, moveSpeed: number, specialMoves: SpecialMove[], location: Location) {
        this.moveSpeed = moveSpeed;
        this.controller = controller;
        this.specialMoves = specialMoves;
        this.location = location;
    }
}
