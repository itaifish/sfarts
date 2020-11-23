"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unitStats_1 = require("./unitStats");
class GameUnit {
    constructor(controller, team, unitStats, specialMoves, location, name) {
        this.unitStats = unitStats_1.copyStats(unitStats);
        this.controller = controller;
        this.team = team;
        this.specialMoves = specialMoves;
        this.specialsUsed = [];
        this.location = location;
        this.turnStartLocation = { x: location.x, y: location.y };
        this.name = name;
    }
    useSpecialAction(special) {
        this.specialsUsed.push(special);
    }
    canUseSpecial(special) {
        return !this.specialsUsed.includes(special);
    }
    useMovesTo(moveAmount, location) {
        this.unitStats.movesRemaining -= moveAmount;
        this.location = { x: location.x, y: location.y };
    }
    processNewTurn() {
        this.turnStartLocation = { x: this.location.x, y: this.location.y };
        this.unitStats.movesRemaining = this.unitStats.moveSpeed;
        this.specialsUsed = [];
    }
}
exports.default = GameUnit;
//# sourceMappingURL=gameUnit.js.map