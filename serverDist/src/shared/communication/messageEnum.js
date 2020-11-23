"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageEnum;
(function (MessageEnum) {
    MessageEnum["CREATE_ACCOUNT"] = "create";
    MessageEnum["LOGIN"] = "login";
    MessageEnum["DISCONNECT"] = "disconnect";
    MessageEnum["ERROR"] = "error";
    MessageEnum["CONNECT"] = "connect";
    MessageEnum["GET_LOBBIES"] = "get lobbies";
    MessageEnum["JOIN_LOBBY"] = "join lobby";
    MessageEnum["CREATE_LOBBY"] = "create lobby";
    MessageEnum["START_GAME"] = "start game";
    MessageEnum["PLAYER_INPUT"] = "player input";
    MessageEnum["END_TURN_SIGNAL"] = "end turn? maybe idk dude";
    MessageEnum["GET_TIME_REMAINING"] = "how much time is remaining bro";
    MessageEnum["RESET_PLAYER_MOVES"] = "undo that shit bro i fucked up";
    MessageEnum["CONCEDE"] = "i give in!!!!";
    MessageEnum["GAME_HAS_ENDED"] = "game over gg wp no re";
})(MessageEnum || (MessageEnum = {}));
exports.default = MessageEnum;
//# sourceMappingURL=messageEnum.js.map