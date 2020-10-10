import GameUnit from "../gameUnit";
import Location from "../location";

export enum MoveActionName {
    ATTACK,
}

export default interface MoveAction {
    actionName: MoveActionName;
    unitDoingAction: GameUnit;
    alliesInvolved: GameUnit[];
    enemiesInvolved: GameUnit[];
    targetedCoordinates: Location;
}
