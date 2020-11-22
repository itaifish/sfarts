import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import SpeederUnit from "../../../shared/game/units/speederUnit";

export default class PhaserSpeederUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, speederUnit: SpeederUnit) {
        const isMine = speederUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "speeder" : "enemySpeeder", speederUnit);
    }
}
