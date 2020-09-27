import socketio from "socket.io-client";
import MessageEnum from "../shared/communication/messageEnum";
import Constants from "../shared/config/constants";
import {
    LoginMessageRequest,
    LoginMessageResponse,
    LoginMessageResponseType,
} from "../shared/communication/messageInterfaces/loginMessage";

export default class Client {
    loginStatus: LoginMessageResponseType | null;

    socket: SocketIOClient.Socket;

    constructor() {
        this.loginStatus = null;
        this.socket = socketio(Constants.URL);
    }

    listen(): void {
        this.socket.on(MessageEnum.CONNECT, () => {
            console.log(`Socket has connected (${this.socket.connected})`);
        });
        this.socket.on(MessageEnum.DISCONNECT, () => {
            this.loginStatus = null;
            console.log(`Socket has disconnected (${this.socket.connected})`);
        });
        this.socket.on(MessageEnum.LOGIN, (msg: LoginMessageResponse) => {
            console.log(`Your login status is now: ${LoginMessageResponseType[msg.status]}`);
            this.loginStatus = msg.status;
        });
    }

    sendLoginAttempt(username: string, password: string): void {
        const loginData: LoginMessageRequest = {
            username: username,
            password: password,
        };
        this.socket.emit(MessageEnum.LOGIN, loginData);
    }
}
