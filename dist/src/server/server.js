"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const constants_1 = __importDefault(require("../shared/config/constants"));
const messageEnum_1 = __importDefault(require("../shared/communication/messageEnum"));
const loginMessage_1 = require("../shared/communication/messageInterfaces/loginMessage");
const userManager_1 = __importDefault(require("./manager/userManager"));
const lobbyManager_1 = __importDefault(require("./manager/lobbyManager"));
const logger_1 = __importStar(require("../shared/utility/logger"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = process.env.PORT || constants_1.default.DEFAULT_PORT;
        this.app.set("port", this.port);
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.default(this.httpServer);
        this.userManager = new userManager_1.default();
        this.lobbyManager = new lobbyManager_1.default();
    }
    listen() {
        this.io.on("connection", (socket) => {
            logger_1.default("Client connected", this.constructor.name, logger_1.LOG_LEVEL.INFO);
            socket.on(messageEnum_1.default.LOGIN, (msg) => {
                const userResult = this.userManager.loginUser(msg.username, msg.password, socket);
                const status = userResult
                    ? loginMessage_1.LoginMessageResponseType.SUCCESS
                    : userResult === null
                        ? loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST
                        : loginMessage_1.LoginMessageResponseType.PASSWORD_INCORRECT;
                const responseMessage = {
                    status: status,
                };
                socket.emit(messageEnum_1.default.LOGIN, responseMessage);
            });
            // Lobbies
            socket.on(messageEnum_1.default.GET_LOBBIES, () => {
                const response = { lobbies: this.lobbyManager.getLobbyList() };
                socket.emit(messageEnum_1.default.GET_LOBBIES, response);
            });
            socket.on(messageEnum_1.default.CREATE_LOBBY, (lobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const createdLobby = this.lobbyManager.userCreateLobby(user, lobbyRequest.lobbySettings);
                // After creating a lobby respond with a list of all lobbies (Should have new lobby)
                const response = { lobby: createdLobby };
                socket.emit(messageEnum_1.default.GET_LOBBIES, response);
            });
            socket.on(messageEnum_1.default.JOIN_LOBBY, (joinLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const joinedLobby = this.lobbyManager.userJoinTeamInLobby(user, joinLobbyRequest.lobbyId, joinLobbyRequest.teamId);
                // After joining a lobby respond with a list of all lobbies (Should have new lobby)
                const response = { lobby: joinedLobby };
                socket.emit(messageEnum_1.default.GET_LOBBIES, response);
            });
            // Default behaviors
            socket.on(messageEnum_1.default.DISCONNECT, (reason) => {
                logger_1.default(`Client disconnected with reason ${reason}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
                this.userManager.userDisconnected(socket.id);
            });
            socket.on(messageEnum_1.default.ERROR, (error) => {
                logger_1.default(`Error: ${JSON.stringify(error)}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            });
        });
        this.httpServer.listen(this.port, () => {
            logger_1.default(`listening on *:${constants_1.default.DEFAULT_PORT}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
        });
    }
}
const runServer = () => {
    const server = new Server();
    server.listen();
};
runServer();
//# sourceMappingURL=server.js.map