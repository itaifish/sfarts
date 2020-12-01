import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import DestroyerUnit from "../../../shared/game/units/destoyerUnit";

export default class PhaserDestroyerUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, destroyerUnit: DestroyerUnit) {
        super(scene, location.x, location.y, destroyerUnit);
    }
}
