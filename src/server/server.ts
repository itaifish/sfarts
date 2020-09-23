import express from "express";
import socketio from "socket.io";
import socketioClient from "socket.io-client";
import http from "http";
import Constants from "./config/constants";
import MessageEnum from "../shared/communication/messageEnum";
import {
    LoginMessageRequest,
    LoginMessageResponse,
    LoginMessageResponseType,
} from "../shared/communication/messageInterfaces/loginMessage";
import UserManager from "./manager/userManager";

class Server {
    // Server Variables
    app;
    port: string | number;
    httpServer: http.Server;
    io: socketio.Server;
    //Managers
    userManager: UserManager;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || Constants.DEFAULT_PORT;
        this.app.set("port", this.port);

        this.httpServer = new http.Server(this.app);
        this.io = new socketio(this.httpServer);

        this.userManager = new UserManager();
    }

    listen() {
        this.io.on("connection", (socket: socketio.EngineSocket) => {
            console.log("Client connected");
            socket.on(MessageEnum.LOGIN, (msg: LoginMessageRequest) => {
                const userResult = this.userManager.loginUser(msg.username, msg.password, socket);
                const status: LoginMessageResponseType = userResult
                    ? LoginMessageResponseType.SUCCESS
                    : userResult === null
                    ? LoginMessageResponseType.USER_NOT_EXIST
                    : LoginMessageResponseType.PASSWORD_INCORRECT;
                socket.emit(MessageEnum.LOGIN, status);
            });
        });

        this.httpServer.listen(this.port, () => {
            console.log(`listening on *:${Constants.DEFAULT_PORT}`);
        });
    }
}

const runServer = () => {
    const server: Server = new Server();
    server.listen();
};

runServer();

// Connect as client - to be removed later
setTimeout(() => {
    const skt = socketioClient("http://localhost:9911");
    skt.emit("msg", "test");
}, 2000);
