import express from "express";
import socketio from "socket.io";
import http from "http";
import Constants from "../shared/config/constants";
import MessageEnum from "../shared/communication/messageEnum";
import {
    LoginMessageRequest,
    LoginMessageResponse,
    LoginMessageResponseType,
} from "../shared/communication/messageInterfaces/loginMessage";
import {
    CreateLobbyRequest,
    GetLobbiesResponse,
    JoinLobbyRequest,
    LobbyResponse,
} from "../shared/communication/messageInterfaces/lobbyMessage";
import UserManager from "./manager/userManager";
import LobbyManger from "./manager/lobbyManager";
import log, { LOG_LEVEL } from "../shared/utility/logger";
import GameManager from "./manager/gameManager";

class Server {
    // Server Variables
    app: express.Express;
    port: string | number;
    httpServer: http.Server;
    io: socketio.Server;
    //Managers
    userManager: UserManager;
    lobbyManager: LobbyManger;
    gameManager: GameManager;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || Constants.DEFAULT_PORT;
        this.app.set("port", this.port);

        this.httpServer = new http.Server(this.app);
        this.io = new socketio(this.httpServer);

        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManger();
        this.gameManager = new GameManager(this.userManager);
    }

    listen(): void {
        this.io.on("connection", (socket: socketio.Socket) => {
            log("Client connected", this.constructor.name, LOG_LEVEL.INFO);
            socket.on(MessageEnum.LOGIN, (msg: LoginMessageRequest) => {
                const userResult = this.userManager.loginUser(msg.username, msg.password, socket);
                const status: LoginMessageResponseType = userResult
                    ? LoginMessageResponseType.SUCCESS
                    : userResult === null
                    ? LoginMessageResponseType.USER_NOT_EXIST
                    : LoginMessageResponseType.PASSWORD_INCORRECT;
                const responseMessage: LoginMessageResponse = {
                    status: status,
                };
                socket.emit(MessageEnum.LOGIN, responseMessage);
            });
            // Lobbies
            socket.on(MessageEnum.GET_LOBBIES, () => {
                const response: GetLobbiesResponse = { lobbies: this.lobbyManager.getLobbyList() };
                socket.emit(MessageEnum.GET_LOBBIES, response);
            });
            socket.on(MessageEnum.CREATE_LOBBY, (lobbyRequest: CreateLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const createdLobby = this.lobbyManager.userCreateLobby(user, lobbyRequest.lobbySettings);
                // After creating a lobby respond with a list of all lobbies (Should have new lobby)
                const response: LobbyResponse = { lobby: createdLobby };
                socket.join(createdLobby.getRoomName());
                socket.emit(MessageEnum.GET_LOBBIES, response);
            });
            socket.on(MessageEnum.JOIN_LOBBY, (joinLobbyRequest: JoinLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const joinedLobby = this.lobbyManager.userJoinTeamInLobby(
                    user,
                    joinLobbyRequest.lobbyId,
                    joinLobbyRequest.teamId,
                );
                // After joining a lobby respond with a list of all lobbies (Should have new lobby)
                const response: LobbyResponse = { lobby: joinedLobby };
                socket.join(joinedLobby.getRoomName());
                this.io.to(joinedLobby.getRoomName()).emit(MessageEnum.GET_LOBBIES, response);
            });
            socket.on(MessageEnum.START_GAME, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const lobby = this.lobbyManager.usersToLobbyMap[user.id];
                this.gameManager.lobbyToGame(lobby);
                this.lobbyManager.deleteLobby(lobby.id);
            });
            // Default behaviors
            socket.on(MessageEnum.DISCONNECT, (reason: string) => {
                log(`Client disconnected with reason ${reason}`, this.constructor.name, LOG_LEVEL.INFO);
                this.userManager.userDisconnected(socket.id);
            });
            socket.on(MessageEnum.ERROR, (error: unknown) => {
                log(`Error: ${JSON.stringify(error)}`, this.constructor.name, LOG_LEVEL.INFO);
            });
        });

        this.httpServer.listen(this.port, () => {
            log(`listening on *:${Constants.DEFAULT_PORT}`, this.constructor.name, LOG_LEVEL.INFO);
        });
    }
}

const runServer = () => {
    const server: Server = new Server();
    server.listen();
};

runServer();
