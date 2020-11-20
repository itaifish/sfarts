import MoveAction from "../../game/move/moveAction";
import SpecialAction from "../../game/move/specialAction";

export enum ACTION_TYPE {
    MOVE,
    SPECIAL,
}
export default interface InputMessageRequest {
    actionType: ACTION_TYPE;
    action: MoveAction | SpecialAction;
}
