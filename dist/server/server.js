"use strict";
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
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = process.env.PORT || constants_1.default.DEFAULT_PORT;
        this.app.set("port", this.port);
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new socket_io_1.default(this.httpServer);
        this.userManager = new userManager_1.default();
    }
    listen() {
        this.io.on("connection", (socket) => {
            console.log("Client connected");
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
            socket.on(messageEnum_1.default.DISCONNECT, (reason) => {
                console.log(`Client disconnected with reason ${reason}`);
                this.userManager.userDisconnected(socket.id);
            });
            socket.on(messageEnum_1.default.ERROR, (error) => {
                console.log(`Error: ${JSON.stringify(error)}`);
            });
        });
        this.httpServer.listen(this.port, () => {
            console.log(`listening on *:${constants_1.default.DEFAULT_PORT}`);
        });
    }
}
const runServer = () => {
    const server = new Server();
    server.listen();
};
runServer();
//# sourceMappingURL=server.js.map