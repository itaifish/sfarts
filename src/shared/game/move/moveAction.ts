import GameUnit from "../units/gameUnit";
import Location from "../location";

export default interface MoveAction {
    unitDoingAction: GameUnit;
    targetedCoordinates: Location;
}
