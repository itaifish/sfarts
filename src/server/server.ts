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
} from "../shared/communication/messageInterfaces/lobbyMessage";
import UserManager from "./manager/userManager";
import LobbyManger from "./manager/lobbyManager";
import log, { LOG_LEVEL } from "../shared/utility/logger";
import GamesManager from "./manager/gamesManager";
import InputMessageRequest, { ACTION_TYPE } from "../shared/communication/messageInterfaces/inputMessage";
import SpecialAction from "../shared/game/move/specialAction";
import { EndTurnRequest, EndTurnResponse } from "../shared/communication/messageInterfaces/endTurnMessage";

class Server {
    // Server Variables
    app: express.Express;
    port: string | number;
    httpServer: http.Server;
    io: socketio.Server;
    //Managers
    userManager: UserManager;
    lobbyManager: LobbyManger;
    gamesManager: GamesManager;

    gameTurnLoops: {
        [gameId: string]: NodeJS.Timeout;
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT || Constants.DEFAULT_PORT;
        this.app.set("port", this.port);

        this.httpServer = new http.Server(this.app);
        this.io = new socketio(this.httpServer);

        this.userManager = new UserManager();
        this.lobbyManager = new LobbyManger();
        this.gamesManager = new GamesManager(this.userManager);
        this.gameTurnLoops = {};
    }

    endTurn(gameId: string): void {
        const gameState = this.gamesManager.endTurnAndGetGameState(gameId);
        const response: EndTurnResponse = {
            gameState: gameState,
        };
        this.io.to(this.gamesManager.lobbyMap[gameId].getRoomName()).emit(MessageEnum.END_TURN_SIGNAL, response);
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
                log(`${user.username} has created lobby ${createdLobby.id}`);
                // After creating a lobby respond with a list of all lobbies (Should have new lobby)
                const response: GetLobbiesResponse = { lobbies: this.lobbyManager.getLobbyList() };
                socket.join(createdLobby.getRoomName());
                socket.emit(MessageEnum.GET_LOBBIES, response);
            });
            socket.on(MessageEnum.JOIN_LOBBY, (joinLobbyRequest: JoinLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                log(
                    `Client ${user.username} attempting to join lobby: ${joinLobbyRequest.lobbyId} on team ${joinLobbyRequest.teamId}`,
                    this.constructor.name,
                    LOG_LEVEL.INFO,
                );
                const usersCurrentLobby = this.lobbyManager.usersToLobbyMap[user.id];
                if (usersCurrentLobby) {
                    // User already exist, remove them from room
                    socket.leave(usersCurrentLobby.getRoomName());
                }
                const joinedLobby = this.lobbyManager.userJoinTeamInLobby(
                    user,
                    joinLobbyRequest.lobbyId,
                    joinLobbyRequest.teamId,
                );
                const response: GetLobbiesResponse = { lobbies: this.lobbyManager.getLobbyList() };
                // After joining a lobby respond with a list of all lobbies (Should have new lobby)
                if (joinedLobby) {
                    socket.join(joinedLobby.getRoomName());
                    this.io.to(joinedLobby.getRoomName()).emit(MessageEnum.GET_LOBBIES, response);
                } else {
                    socket.emit(MessageEnum.GET_LOBBIES, response);
                }
            });
            socket.on(MessageEnum.START_GAME, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const lobby = this.lobbyManager.usersToLobbyMap[user.id];
                this.gamesManager.lobbyToGame(lobby);
                this.lobbyManager.deleteLobby(lobby.id);
            });
            socket.on(MessageEnum.PLAYER_INPUT, (inputMessageRequest: InputMessageRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    if (inputMessageRequest.actionType == ACTION_TYPE.SPECIAL) {
                        this.gamesManager.addPlayerSpecial(user.id, inputMessageRequest.action as SpecialAction);
                    } else {
                        this.gamesManager.addPlayerMove(user.id, inputMessageRequest.action);
                    }
                }
            });
            socket.on(MessageEnum.END_TURN_SIGNAL, (endTurnRequest: EndTurnRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                }
                const game = this.gamesManager.playerToGameManager(user.id);
                this.gamesManager.playerSendsEndTurnSignal(user.id, endTurnRequest.playerHasEndedTurn);
                if (this.gamesManager.allPlayersHaveEndedTurn(game.gameId)) {
                    const intervalLoop = this.gameTurnLoops[game.gameId];
                    // if not the first turn, reset game interval loop
                    if (intervalLoop) {
                        clearInterval(intervalLoop);
                    }
                    this.endTurn(game.gameId);
                    this.gameTurnLoops[game.gameId] = setInterval(() => {
                        this.endTurn(game.gameId);
                    }, this.gamesManager.lobbyMap[game.gameId].settings.turnTime);
                }
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
