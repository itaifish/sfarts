import socketio from "socket.io-client";
import MessageEnum from "../shared/communication/messageEnum";
import Constants from "../shared/config/constants";
import {
    LoginMessageRequest,
    LoginMessageResponse,
    LoginMessageResponseType,
} from "../shared/communication/messageInterfaces/loginMessage";
import Lobby from "../server/room/lobby/lobby";
import { GetLobbiesResponse } from "../shared/communication/messageInterfaces/lobbyMessage";
import log, { LOG_LEVEL } from "../shared/utility/logger";

type callbackFunction = (...args: any[]) => void;

export default class Client {
    loginStatus: LoginMessageResponseType | null;

    lobbyList: Lobby[];

    socket: SocketIOClient.Socket;

    messageCallbacks: {
        [key in MessageEnum]: callbackFunction[];
    };

    constructor() {
        this.loginStatus = null;
        this.lobbyList = [];
        this.socket = socketio(Constants.URL);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.messageCallbacks = {};
        for (const key in MessageEnum) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.messageCallbacks[MessageEnum[key]] = [];
        }
    }

    listen(): void {
        this.socket.on(MessageEnum.CONNECT, () => {
            log(`Socket has connected (${this.socket.connected})`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.CONNECT);
        });
        this.socket.on(MessageEnum.DISCONNECT, () => {
            this.loginStatus = null;
            log(`Socket has disconnected (${this.socket.connected})`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.DISCONNECT);
        });
        this.socket.on(MessageEnum.LOGIN, (msg: LoginMessageResponse) => {
            log(
                `Your login status is now: ${LoginMessageResponseType[msg.status]}`,
                this.constructor.name,
                LOG_LEVEL.INFO,
            );
            this.loginStatus = msg.status;
            this.runAndRemoveCallbacks(MessageEnum.LOGIN);
        });
        this.socket.on(MessageEnum.GET_LOBBIES, (response: GetLobbiesResponse) => {
            this.lobbyList = response.lobbies;
            log(`Got ${this.lobbyList.length} lobbies`, this.constructor.name, LOG_LEVEL.INFO);
            this.runAndRemoveCallbacks(MessageEnum.GET_LOBBIES);
        });
    }

    /** Server Communication **/

    sendLoginAttempt(username: string, password: string): void {
        const loginData: LoginMessageRequest = {
            username: username,
            password: password,
        };
        this.socket.emit(MessageEnum.LOGIN, loginData);
    }

    loadLobbyList(callbackFunc?: callbackFunction): void {
        if (callbackFunc) {
            this.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, callbackFunc);
        }
        this.socket.emit(MessageEnum.GET_LOBBIES);
    }

    /**************************/

    addOnServerMessageCallback(serverMessage: MessageEnum, callbackFunc: callbackFunction): void {
        this.messageCallbacks[serverMessage].push(callbackFunc);
    }

    private runAndRemoveCallbacks(serverMessage: MessageEnum): void {
        this.messageCallbacks[serverMessage].forEach((callback) => callback());
        this.messageCallbacks[serverMessage] = [];
    }
}
