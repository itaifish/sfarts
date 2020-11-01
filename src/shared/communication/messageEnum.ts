enum MessageEnum {
    LOGIN = "login",
    DISCONNECT = "disconnect", // Reserved namespace
    ERROR = "error", // Reserved namespace
    CONNECT = "connect",
    GET_LOBBIES = "get lobbies",
    JOIN_LOBBY = "join lobby",
    CREATE_LOBBY = "create lobby",
}

export default MessageEnum;
