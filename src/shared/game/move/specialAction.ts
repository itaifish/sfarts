import GameUnit from "../units/gameUnit";
import MoveAction from "./moveAction";

export enum SpecialActionName {
    ATTACK,
    HEAL,
}

export default interface SpecialAction extends MoveAction {
    actionName: SpecialActionName;
    alliesInvolved: GameUnit[];
    enemiesInvolved: GameUnit[];
    amounts: number[];
}
