import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import DestroyerUnit from "../../../shared/game/units/destoyerUnit";

export default class PhaserDestroyerUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, destroyerUnit: DestroyerUnit) {
        const isMine = destroyerUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "destroyer" : "enemyDestroyer", destroyerUnit);
    }
}
