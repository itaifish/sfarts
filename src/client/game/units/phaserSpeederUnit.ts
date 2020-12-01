import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import SpeederUnit from "../../../shared/game/units/speederUnit";

export default class PhaserSpeederUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, speederUnit: SpeederUnit) {
        super(scene, location.x, location.y, speederUnit);
    }
}
