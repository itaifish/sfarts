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
const gamesManager_1 = __importDefault(require("./manager/gamesManager"));
const inputMessage_1 = require("../shared/communication/messageInterfaces/inputMessage");
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = process.env.PORT || constants_1.default.DEFAULT_PORT;
        this.app.set("port", this.port);
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.default(this.httpServer);
        this.userManager = new userManager_1.default();
        this.lobbyManager = new lobbyManager_1.default();
        this.gamesManager = new gamesManager_1.default(this.userManager);
        this.gameTurnLoops = {};
    }
    endTurn(gameId) {
        var _a;
        logger_1.default(`Ending the turn for game ${gameId}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
        const gameState = this.gamesManager.endTurnAndGetGameState(gameId);
        if ((_a = this.gameTurnLoops[gameId]) === null || _a === void 0 ? void 0 : _a.endTime) {
            this.gameTurnLoops[gameId].endTime =
                new Date().getTime() + this.gamesManager.lobbyMap[gameId].settings.turnTime;
        }
        const response = {
            gameState: gameState,
        };
        this.io.to(this.gamesManager.lobbyMap[gameId].getRoomName()).emit(messageEnum_1.default.END_TURN_SIGNAL, response);
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
                if (userResult) {
                    responseMessage.id = userResult.id;
                    const usersLobby = this.gamesManager.usersToLobbyMap[userResult.id];
                    const usersGame = this.gamesManager.lobbyToGameManagerMap[usersLobby === null || usersLobby === void 0 ? void 0 : usersLobby.id];
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
                socket.emit(messageEnum_1.default.LOGIN, responseMessage);
            });
            // Lobbies
            socket.on(messageEnum_1.default.GET_LOBBIES, () => {
                const response = { lobbies: this.lobbyManager.getLobbyList() };
                socket.emit(messageEnum_1.default.GET_LOBBIES, response);
            });
            socket.on(messageEnum_1.default.CREATE_LOBBY, (lobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    return socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
                }
                const createdLobby = this.lobbyManager.userCreateLobby(user, lobbyRequest.lobbySettings);
                logger_1.default(`${user.username} has created lobby ${createdLobby.id}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
                // After creating a lobby respond with a list of all lobbies (Should have new lobby)
                const response = { lobbies: this.lobbyManager.getLobbyList() };
                socket.join(createdLobby.getRoomName());
                socket.emit(messageEnum_1.default.GET_LOBBIES, response);
            });
            socket.on(messageEnum_1.default.JOIN_LOBBY, (joinLobbyRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                logger_1.default(`Client ${user.username} attempting to join lobby: ${joinLobbyRequest.lobbyId} on team ${joinLobbyRequest.teamId}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
                const usersCurrentLobby = this.lobbyManager.usersToLobbyMap[user.id];
                if (usersCurrentLobby) {
                    // User already exist, remove them from room
                    socket.leave(usersCurrentLobby.getRoomName());
                }
                // disconnect player first
                this.lobbyManager.playerDisconnects(user);
                const joinedLobby = this.lobbyManager.userJoinTeamInLobby(user, joinLobbyRequest.lobbyId, joinLobbyRequest.teamId);
                const response = { lobbies: this.lobbyManager.getLobbyList() };
                // After joining a lobby respond with a list of all lobbies (Should have new lobby)
                if (joinedLobby) {
                    socket.join(joinedLobby.getRoomName());
                    this.io.to(joinedLobby.getRoomName()).emit(messageEnum_1.default.GET_LOBBIES, response);
                }
                else {
                    socket.emit(messageEnum_1.default.GET_LOBBIES, response);
                }
            });
            socket.on(messageEnum_1.default.START_GAME, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                const lobby = this.lobbyManager.usersToLobbyMap[user.id];
                if (lobby.lobbyLeader == user.id) {
                    const createdManager = this.gamesManager.lobbyToGame(lobby);
                    const response = {
                        gameState: createdManager.boardState,
                        gameId: createdManager.gameId,
                    };
                    logger_1.default(`Sending boardstate and game start info to clients for lobby ${createdManager.gameId}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
                    this.io.to(lobby.getRoomName()).emit(messageEnum_1.default.START_GAME, response);
                    this.lobbyManager.deleteLobby(lobby.id);
                }
            });
            socket.on(messageEnum_1.default.PLAYER_INPUT, (inputMessageRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
                }
                else {
                    logger_1.default(`Adding player ${user.id}'s move to: ${JSON.stringify(inputMessageRequest.action.targetedCoordinates)}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
                    if (inputMessageRequest.actionType == inputMessage_1.ACTION_TYPE.SPECIAL) {
                        this.gamesManager.addPlayerSpecial(user.id, inputMessageRequest.action);
                    }
                    else {
                        this.gamesManager.addPlayerMove(user.id, inputMessageRequest.action);
                    }
                }
            });
            socket.on(messageEnum_1.default.END_TURN_SIGNAL, (endTurnRequest) => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    return socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
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
                }
                else {
                    const msg = {
                        winner: "Not you lmao",
                    };
                    return socket.emit(messageEnum_1.default.GAME_HAS_ENDED, msg);
                }
            });
            socket.on(messageEnum_1.default.GET_TIME_REMAINING, () => {
                var _a;
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
                }
                else {
                    const game = this.gamesManager.playerToGameManager(user.id);
                    const endTime = (_a = this.gameTurnLoops[game.gameId]) === null || _a === void 0 ? void 0 : _a.endTime;
                    socket.emit(messageEnum_1.default.GET_TIME_REMAINING, endTime || 0);
                }
            });
            socket.on(messageEnum_1.default.RESET_PLAYER_MOVES, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
                }
                else {
                    const state = this.gamesManager.resetPlayerMoves(user.id);
                    const response = {
                        gameState: state,
                    };
                    socket.emit(messageEnum_1.default.RESET_PLAYER_MOVES, response);
                }
            });
            socket.on(messageEnum_1.default.CONCEDE, () => {
                const user = this.userManager.getUserFromSocketId(socket.id);
                if (!user) {
                    socket.emit(messageEnum_1.default.LOGIN, { status: loginMessage_1.LoginMessageResponseType.USER_NOT_EXIST });
                }
                else {
                    const winner = this.gamesManager.gameOver(user.id);
                    if (winner) {
                        let usersUsername = "nobody";
                        if (winner.winnerId) {
                            usersUsername = this.userManager.getUserFromUserId(winner.winnerId).username;
                        }
                        else {
                            logger_1.default(`No user winning for game ${JSON.stringify(winner)}`, this.constructor.name, logger_1.LOG_LEVEL.WARN);
                        }
                        const gameOverResponse = {
                            winner: usersUsername,
                        };
                        this.io.to(winner.roomName).emit(messageEnum_1.default.GAME_HAS_ENDED, gameOverResponse);
                        this.io
                            .of("/")
                            .in(winner.roomName)
                            .clients((error, socketIds) => {
                            if (error)
                                throw error;
                            socketIds.forEach((socketId) => this.io.sockets.sockets[socketId].leave(winner.roomName));
                        });
                    }
                }
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