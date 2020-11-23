export default interface UnitStats {
    moveSpeed: number;
    movesRemaining: number;
    maxHealth: number;
    health: number;
    damage?: number;
    range?: number;
}

export const copyStats = (stats: UnitStats) => {
    return {
        moveSpeed: stats.moveSpeed,
        movesRemaining: stats.movesRemaining,
        maxHealth: stats.maxHealth,
        health: stats.health,
        damage: stats.damage,
        range: stats.range,
    };
};
