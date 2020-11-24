import PhaserGameUnit from "./phaserGameUnit";
import Location from "../../../shared/game/location";
import GameScene from "../scene/gameScene";
import FighterUnit from "../../../shared/game/units/fighterUnit";

export default class PhaserFighterUnit extends PhaserGameUnit {
    constructor(scene: GameScene, location: Location, fighterUnit: FighterUnit) {
        const isMine = fighterUnit.controller == scene.client.userId;
        super(scene, location.x, location.y, isMine ? "fighter" : "enemyFighter", fighterUnit);
    }
}
