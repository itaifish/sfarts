import GameUnit from "../units/gameUnit";
import Location from "../location";
import MoveAction from "./moveAction";

export enum SpecialActionName {
    ATTACK,
}

export default interface SpecialAction extends MoveAction {
    actionName: SpecialActionName;
    alliesInvolved: GameUnit[];
    enemiesInvolved: GameUnit[];
    amounts: number[];
}
