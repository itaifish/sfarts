import MoveAction, { MoveActionName } from "./moveAction";
import GameUnit from "../gameUnit";

export default class SpecialMove {
    moveAction: MoveAction;

    constructor(moveAction: MoveAction) {
        this.moveAction = moveAction;
    }

    static getAttackMove(unitAttacking: GameUnit, unitBeingAttacked: GameUnit): SpecialMove {
        return new SpecialMove({
            actionName: MoveActionName.ATTACK,
            unitDoingAction: unitAttacking,
            alliesInvolved: [],
            enemiesInvolved: [unitBeingAttacked],
            targetedCoordinates: unitBeingAttacked.location,
        });
    }
}
