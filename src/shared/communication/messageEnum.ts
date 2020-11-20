enum MessageEnum {
    LOGIN = "login",
    DISCONNECT = "disconnect", // Reserved namespace
    ERROR = "error", // Reserved namespace
    CONNECT = "connect",
    GET_LOBBIES = "get lobbies",
    JOIN_LOBBY = "join lobby",
    CREATE_LOBBY = "create lobby",
    START_GAME = "start game",
    PLAYER_INPUT = "player input",
    END_TURN_SIGNAL = "end turn? maybe idk dude",
}

export default MessageEnum;
