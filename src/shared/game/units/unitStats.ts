import Fighter from "../../../client/resources/images/fighter.png";
import EnemyFighter from "../../../client/resources/images/enemyfighter.png";
import Speeder from "../../../client/resources/images/speeder.png";
import EnemySpeeder from "../../../client/resources/images/enemyspeeder.png";
import Destroyer from "../../../client/resources/images/destroyer.png";
import EnemyDestroyer from "../../../client/resources/images/enemydestroyer.png";
import MainBase from "../../../client/resources/images/mainbase.png";
import EnemyMainBase from "../../../client/resources/images/mainbaseenemy.png";

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

interface texture {
    name: string;
    image: any;
}

export const unitNameToTextureMap: {
    [unitName: string]: {
        ally: texture;
        enemy: texture;
    };
} = {
    FighterUnit: {
        ally: {
            name: "fighter",
            image: Fighter,
        },
        enemy: {
            name: "enemyFighter",
            image: EnemyFighter,
        },
    },
    SpeederUnit: {
        ally: {
            name: "speeder",
            image: Speeder,
        },
        enemy: {
            name: "enemySpeeder",
            image: EnemySpeeder,
        },
    },
    DestroyerUnit: {
        ally: {
            name: "destroyer",
            image: Destroyer,
        },
        enemy: {
            name: "enemyDestroyer",
            image: EnemyDestroyer,
        },
    },
    MainBaseUnit: {
        ally: {
            name: "mainbase",
            image: MainBase,
        },
        enemy: {
            name: "enemyMainbase",
            image: EnemyMainBase,
        },
    },
};
