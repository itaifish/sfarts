"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStats = void 0;
exports.copyStats = (stats) => {
    return {
        moveSpeed: stats.moveSpeed,
        movesRemaining: stats.movesRemaining,
        maxHealth: stats.maxHealth,
        health: stats.health,
        damage: stats.damage,
        range: stats.range,
    };
};
//# sourceMappingURL=unitStats.js.map