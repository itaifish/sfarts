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
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const messageEnum_1 = __importDefault(require("../shared/communication/messageEnum"));
const constants_1 = __importDefault(require("../shared/config/constants"));
const loginMessage_1 = require("../shared/communication/messageInterfaces/loginMessage");
const logger_1 = __importStar(require("../shared/utility/logger"));
const gameManager_1 = __importDefault(require("../shared/game/manager/gameManager"));
const inputMessage_1 = require("../shared/communication/messageInterfaces/inputMessage");
class Client {
    constructor() {
        this.gameManager = null;
        this.loginStatus = null;
        this.userId = null;
        this.gameOverWinner = null;
        this.lobbyList = [];
        this.socket = socket_io_client_1.default(constants_1.default.URL);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.messageCallbacks = {};
        for (const key in messageEnum_1.default) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.messageCallbacks[messageEnum_1.default[key]] = [];
        }
        this.updateBoardStateCallback = (boardState) => {
            logger_1.default("This function should absolutely never be called", this.constructor.name, logger_1.LOG_LEVEL.WARN);
        };
    }
    listen() {
        this.socket.on(messageEnum_1.default.CONNECT, () => {
            logger_1.default(`Socket has connected (${this.socket.connected})`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(messageEnum_1.default.CONNECT);
        });
        this.socket.on(messageEnum_1.default.DISCONNECT, () => {
            this.loginStatus = null;
            logger_1.default(`Socket has disconnected (${this.socket.connected})`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(messageEnum_1.default.DISCONNECT);
        });
        this.socket.on(messageEnum_1.default.LOGIN, (msg) => {
            logger_1.default(`Your login status is now: ${loginMessage_1.LoginMessageResponseType[msg.status]}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.loginStatus = msg.status;
            this.userId = msg.id;
            if (msg.gameStateToRejoin) {
                this.gameManager = new gameManager_1.default(msg.gameStateToRejoin.gameId, this.userId, []);
                this.gameManager.copyBoardState(msg.gameStateToRejoin.gameState);
            }
            this.runAndRemoveCallbacks(messageEnum_1.default.LOGIN);
        });
        this.socket.on(messageEnum_1.default.CREATE_ACCOUNT, (msg) => {
            this.loginStatus = msg.status;
            this.runAndRemoveCallbacks(messageEnum_1.default.CREATE_ACCOUNT);
        });
        this.socket.on(messageEnum_1.default.GET_LOBBIES, (response) => {
            logger_1.default(`Got this response: ${JSON.stringify(response)}`, this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
            this.lobbyList = response.lobbies;
            logger_1.default(`Got ${this.lobbyList.length} lobbies`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(messageEnum_1.default.GET_LOBBIES);
        });
        this.socket.on(messageEnum_1.default.END_TURN_SIGNAL, (response) => {
            this.gameManager.endTurn();
            this.gameManager.copyBoardState(response.gameState);
            this.updateBoardStateCallback(this.gameManager.boardState);
            this.runAndRemoveCallbacks(messageEnum_1.default.END_TURN_SIGNAL);
        });
        this.socket.on(messageEnum_1.default.START_GAME, (response) => {
            logger_1.default(`Starting game: ${response.gameId}`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.gameManager = new gameManager_1.default(response.gameId, this.userId, []);
            this.gameManager.copyBoardState(response.gameState);
            this.runAndRemoveCallbacks(messageEnum_1.default.START_GAME);
        });
        this.socket.on(messageEnum_1.default.RESET_PLAYER_MOVES, (response) => {
            this.gameManager.copyBoardState(response.gameState);
            this.updateBoardStateCallback(this.gameManager.boardState);
            this.runAndRemoveCallbacks(messageEnum_1.default.RESET_PLAYER_MOVES);
        });
        this.socket.on(messageEnum_1.default.GAME_HAS_ENDED, (response) => {
            this.gameOverWinner = response.winner;
            this.gameManager = null;
            this.runAndRemoveCallbacks(messageEnum_1.default.GAME_HAS_ENDED);
        });
    }
    /** Server Communication **/
    createAccount(username, password, callbackFunc) {
        const loginData = {
            username: username,
            password: password,
        };
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.CREATE_ACCOUNT, callbackFunc);
        }
        this.socket.emit(messageEnum_1.default.CREATE_ACCOUNT, loginData);
    }
    sendLoginAttempt(username, password) {
        const loginData = {
            username: username,
            password: password,
        };
        this.socket.emit(messageEnum_1.default.LOGIN, loginData);
    }
    createLobby(settings) {
        const createLobbyRequest = {
            lobbySettings: settings,
        };
        this.socket.emit(messageEnum_1.default.CREATE_LOBBY, createLobbyRequest);
    }
    joinLobby(lobbyId, teamId, callbackFunc) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.GET_LOBBIES, callbackFunc);
        }
        const joinLobbyRequest = {
            lobbyId: lobbyId,
            teamId: teamId,
        };
        this.socket.emit(messageEnum_1.default.JOIN_LOBBY, joinLobbyRequest);
    }
    leaveLobby(lobbyId, callbackFunc) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.GET_LOBBIES, callbackFunc);
        }
        // join a non-existant team in lobby to leave
        const joinLobbyRequest = {
            lobbyId: lobbyId,
            teamId: -1,
        };
        this.socket.emit(messageEnum_1.default.JOIN_LOBBY, joinLobbyRequest);
    }
    loadLobbyList(callbackFunc) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.GET_LOBBIES, callbackFunc);
        }
        this.socket.emit(messageEnum_1.default.GET_LOBBIES);
    }
    startGame(callbackFunc) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.START_GAME, callbackFunc);
        }
        this.socket.emit(messageEnum_1.default.START_GAME);
    }
    sendMove(move) {
        const request = {
            actionType: inputMessage_1.ACTION_TYPE.MOVE,
            action: move,
        };
        this.socket.emit(messageEnum_1.default.PLAYER_INPUT, request);
    }
    sendSpecial(special) {
        const request = {
            actionType: inputMessage_1.ACTION_TYPE.SPECIAL,
            action: special,
        };
        this.socket.emit(messageEnum_1.default.PLAYER_INPUT, request);
    }
    setEndTurn(endTurn) {
        const request = {
            playerHasEndedTurn: endTurn,
        };
        this.socket.emit(messageEnum_1.default.END_TURN_SIGNAL, request);
    }
    resetMoves() {
        this.socket.emit(messageEnum_1.default.RESET_PLAYER_MOVES);
    }
    concede() {
        this.socket.emit(messageEnum_1.default.CONCEDE);
    }
    getTimeRemaining(processRemainingTimeFunction) {
        // add callback for time remaining to call function
        // send request
    }
    /**************************/
    addOnServerMessageCallback(serverMessage, callbackFunc) {
        this.messageCallbacks[serverMessage].push(callbackFunc);
    }
    runAndRemoveCallbacks(serverMessage) {
        this.messageCallbacks[serverMessage].forEach((callback) => callback());
        this.messageCallbacks[serverMessage] = [];
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map