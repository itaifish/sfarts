import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";

export default class PhaserFighterUnit extends PhaserGameUnit {
    constructor(scene: Phaser.Scene, location: Location) {
        super(scene, location.x, location.y, "fighter");
    }
}
