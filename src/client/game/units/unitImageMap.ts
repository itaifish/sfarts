import Fighter from "../../resources/images/fighter.png";
import EnemyFighter from "../../resources/images/enemyfighter.png";
import Speeder from "../../resources/images/speeder.png";
import EnemySpeeder from "../../resources/images/enemyspeeder.png";
import Destroyer from "../../resources/images/destroyer.png";
import EnemyDestroyer from "../../resources/images/enemydestroyer.png";
import MainBase from "../../resources/images/mainbase.png";
import EnemyMainBase from "../../resources/images/mainbaseenemy.png";
import Medfighter from "../../resources/images/medfighter.png";

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

    MedfighterUnit: {
        ally: {
            name: "medfighter",

            image: Medfighter,
        },

        enemy: {
            name: "enemyMedfighter",

            image: Medfighter,
        },
    },
};
