"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const messageEnum_1 = __importDefault(require("../shared/communication/messageEnum"));
const constants_1 = __importDefault(require("../shared/config/constants"));
const loginMessage_1 = require("../shared/communication/messageInterfaces/loginMessage");
class Client {
    constructor() {
        this.loginStatus = null;
        this.socket = socket_io_client_1.default(constants_1.default.URL);
    }
    listen() {
        this.socket.on(messageEnum_1.default.CONNECT, () => {
            console.log(`Socket has connected (${this.socket.connected})`);
        });
        this.socket.on(messageEnum_1.default.DISCONNECT, () => {
            this.loginStatus = null;
            console.log(`Socket has disconnected (${this.socket.connected})`);
        });
        this.socket.on(messageEnum_1.default.LOGIN, (msg) => {
            console.log(`Your login status is now: ${loginMessage_1.LoginMessageResponseType[msg.status]}`);
            this.loginStatus = msg.status;
        });
    }
    sendLoginAttempt(username, password) {
        const loginData = {
            username: username,
            password: password,
        };
        this.socket.emit(messageEnum_1.default.LOGIN, loginData);
    }
}
const startClient = () => {
    const client = new Client();
    client.listen();
    client.sendLoginAttempt("Fisherswamp", "1234");
    client.sendLoginAttempt("Redstreak4", "4567");
};
startClient();
//# sourceMappingURL=client.js.map