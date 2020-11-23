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
class Client {
    constructor() {
        this.loginStatus = null;
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
            this.runAndRemoveCallbacks(messageEnum_1.default.LOGIN);
        });
        this.socket.on(messageEnum_1.default.GET_LOBBIES, (response) => {
            this.lobbyList = response.lobbies;
            logger_1.default(`Got ${this.lobbyList.length} lobbies`, this.constructor.name, logger_1.LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(messageEnum_1.default.GET_LOBBIES);
        });
    }
    /** Server Communication **/
    sendLoginAttempt(username, password) {
        const loginData = {
            username: username,
            password: password,
        };
        this.socket.emit(messageEnum_1.default.LOGIN, loginData);
    }
    loadLobbyList(callbackFunc) {
        if (callbackFunc) {
            this.addOnServerMessageCallback(messageEnum_1.default.GET_LOBBIES, callbackFunc);
        }
        this.socket.emit(messageEnum_1.default.GET_LOBBIES);
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