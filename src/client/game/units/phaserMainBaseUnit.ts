import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import MainBaseUnit from "../../../shared/game/units/mainBaseUnit";

export default class PhaserMainBaseUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, mainBaseUnit: MainBaseUnit) {
        super(scene, location.x, location.y, mainBaseUnit);
    }
}
