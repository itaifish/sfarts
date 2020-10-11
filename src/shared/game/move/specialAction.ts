import GameUnit from "../units/gameUnit";
import Location from "../location";

export enum SpecialActionName {
    ATTACK,
}

export default interface SpecialAction {
    actionName: SpecialActionName;
    unitDoingAction: GameUnit;
    alliesInvolved: GameUnit[];
    enemiesInvolved: GameUnit[];
    targetedCoordinates: Location;
    amounts: number[];
}
