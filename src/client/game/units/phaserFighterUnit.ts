import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";

export default class PhaserFighterUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location) {
        super(scene, location.x, location.y, "fighter");
    }
}
