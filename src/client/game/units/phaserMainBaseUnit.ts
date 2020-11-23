import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import DestroyerUnit from "../../../shared/game/units/destoyerUnit";
import MainBaseUnit from "../../../shared/game/units/mainBaseUnit";

export default class PhaserMainBaseUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, mainBaseUnit: MainBaseUnit) {
        const isMine = mainBaseUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "mainbase" : "enemyMainbase", mainBaseUnit);
    }
}
