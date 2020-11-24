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
import { EndTurnRequest, GameStateResponse } from "../shared/communication/messageInterfaces/endTurnMessage";
import GameOverMessage from "../shared/communication/messageInterfaces/gameOverMessage";
import ServerStatsMessage from "../shared/communication/messageInterfaces/serverStatsMessage";

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
        [gameId: string]: {
            timeOut: NodeJS.Timeout;
            endTime: number;
        };
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
        log(`Ending the turn for game ${gameId}`, this.constructor.name, LOG_LEVEL.INFO);
        const gameState = this.gamesManager.endTurnAndGetGameState(gameId);
        if (this.gameTurnLoops[gameId]?.endTime) {
            this.gameTurnLoops[gameId].endTime =
                new Date().getTime() + this.gamesManager.lobbyMap[gameId].settings.turnTime;
        }
        const response: GameStateResponse = {
            gameState: gameState,
        };
        this.io.to(this.gamesManager.lobbyMap[gameId].getRoomName()).emit(MessageEnum.END_TURN_SIGNAL, response);
    }

    listen(): void {
        this.io.on("connection", (socket: socketio.Socket) => {
            log("Client connected", this.constructor.name, LOG_LEVEL.INFO);
            socket.on(MessageEnum.CREATE_ACCOUNT, (msg: LoginMessageRequest) => {
                const result = this.userManager.createUser(msg.username, msg.password);
                const status: LoginMessageResponseType = result
                    ? LoginMessageResponseType.SUCCESS
                    : LoginMessageResponseType.USER_NOT_EXIST;
                log(
                    `User attempting to create account: ${result ? " Success " : " Failed "}`,
                    this.constructor.name,
                    LOG_LEVEL.DEBUG,
                );
                socket.emit(MessageEnum.CREATE_ACCOUNT, { status: status });
            });
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
                if (userResult) {
                    responseMessage.id = userResult.id;
                    const usersLobby = this.gamesManager.usersToLobbyMap[userResult.id];
                    const usersGame = this.gamesManager.lobbyToGameManagerMap[usersLobby?.id];
                    // rejoin left game
                    if (usersGame) {
                        socket.join(usersLobby.getRoomName());
                        responseMessage.gameStateToRejoin = {
                            gameState: usersGame.boardState,
                            gameId: usersGame.gameId,
                        };
                        // reset moves so player is seeing same thing as server
                        usersGame.resetPlayerMoves(userResult.id);
                    }
                }
                socket.emit(MessageEnum.LOGIN, responseMessage);
            });
            // Lobbies
            socket.on(MessageEnum.GET_LOBBIES, () => {
                const response: GetLobbiesResponse = { lobbies: this.lobbyManager.getLobbyList() };
                socket.emit(MessageEnum.GET_LOBBIES, response);
            });
            socket.on(MessageEnum.CREATE_LOBBY, (lobbyRequest: CreateLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    return socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                }
                const createdLobby = this.lobbyManager.userCreateLobby(user, lobbyRequest.lobbySettings);
                log(`${user.username} has created lobby ${createdLobby.id}`, this.constructor.name, LOG_LEVEL.INFO);
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
                // disconnect player first
                this.lobbyManager.playerDisconnects(user);
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
                if (lobby.lobbyLeader == user.id) {
                    const createdManager = this.gamesManager.lobbyToGame(lobby);
                    const response: GameStateResponse = {
                        gameState: createdManager.boardState,
                        gameId: createdManager.gameId,
                    };
                    log(
                        `Sending boardstate and game start info to clients for lobby ${createdManager.gameId}`,
                        this.constructor.name,
                        LOG_LEVEL.INFO,
                    );
                    this.io.to(lobby.getRoomName()).emit(MessageEnum.START_GAME, response);
                    this.lobbyManager.deleteLobby(lobby.id);
                }
            });
            socket.on(MessageEnum.PLAYER_INPUT, (inputMessageRequest: InputMessageRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    log(
                        `Adding player ${user.id}'s move to: ${JSON.stringify(
                            inputMessageRequest.action.targetedCoordinates,
                        )}`,
                        this.constructor.name,
                        LOG_LEVEL.INFO,
                    );
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
                    return socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                }
                const game = this.gamesManager.playerToGameManager(user.id);
                if (game) {
                    this.gamesManager.playerSendsEndTurnSignal(user.id, endTurnRequest.playerHasEndedTurn);
                    if (this.gamesManager.allPlayersHaveEndedTurn(game.gameId)) {
                        const intervalLoop = this.gameTurnLoops[game.gameId];
                        // if not the first turn, reset game interval loop
                        if (intervalLoop) {
                            clearInterval(intervalLoop.timeOut);
                        }
                        const turnTime = this.gamesManager.lobbyMap[game.gameId].settings.turnTime;
                        if (turnTime > 0) {
                            this.gameTurnLoops[game.gameId] = {
                                endTime: new Date().getTime() + turnTime,
                                timeOut: setInterval(() => {
                                    this.endTurn(game.gameId);
                                }, turnTime),
                            };
                        }

                        this.endTurn(game.gameId);
                    }
                } else {
                    const msg: GameOverMessage = {
                        winner: "Not you lmao",
                    };
                    return socket.emit(MessageEnum.GAME_HAS_ENDED, msg);
                }
            });
            socket.on(MessageEnum.GET_TIME_REMAINING, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    const game = this.gamesManager.playerToGameManager(user.id);
                    const endTime = this.gameTurnLoops[game.gameId]?.endTime;
                    socket.emit(MessageEnum.GET_TIME_REMAINING, endTime || 0);
                }
            });
            socket.on(MessageEnum.RESET_PLAYER_MOVES, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    const state = this.gamesManager.resetPlayerMoves(user.id);
                    const response: GameStateResponse = {
                        gameState: state,
                    };
                    socket.emit(MessageEnum.RESET_PLAYER_MOVES, response);
                }
            });
            socket.on(MessageEnum.CONCEDE, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    const winner = this.gamesManager.gameOver(user.id);
                    if (winner) {
                        let usersUsername = "nobody";
                        if (winner.winnerId) {
                            usersUsername = this.userManager.getUserFromUserId(winner.winnerId).username;
                        } else {
                            log(
                                `No user winning for game ${JSON.stringify(winner)}`,
                                this.constructor.name,
                                LOG_LEVEL.WARN,
                            );
                        }
                        const gameOverResponse: GameOverMessage = {
                            winner: usersUsername,
                        };
                        this.io.to(winner.roomName).emit(MessageEnum.GAME_HAS_ENDED, gameOverResponse);
                        this.io
                            .of("/")
                            .in(winner.roomName)
                            .clients((error: Error, socketIds: string[]) => {
                                if (error) throw error;
                                socketIds.forEach((socketId) =>
                                    this.io.sockets.sockets[socketId].leave(winner.roomName),
                                );
                            });
                    }
                }
            });
            socket.on(MessageEnum.GET_SERVER_STATS, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(MessageEnum.LOGIN, { status: LoginMessageResponseType.USER_NOT_EXIST });
                } else {
                    const serverStats: ServerStatsMessage = {
                        numberOfGames: Object.keys(this.gamesManager.lobbyToGameManagerMap).length,
                        numberOfLobbies: Object.keys(this.lobbyManager.lobbyMap).length,
                        username: user.username,
                    };
                    socket.emit(MessageEnum.GET_SERVER_STATS, serverStats);
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
    process.on("uncaughtException", function (err) {
        log(`Caught exception: ${err.message}`);
    });
    const server: Server = new Server();
    server.listen();
};

runServer();
