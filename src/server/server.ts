import express from "express";
import socketio from "socket.io";
import socketioClient from "socket.io-client";
import http from "http";
import Constants from "./config/constants";

const app = express();
const port = process.env.PORT || Constants.DEFAULT_PORT;
app.set("port", port);

const httpServer = new http.Server(app);
const io = new socketio(httpServer);

app.get("/", (request: any, response: any) => {
    response.send("test");
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
io.on("connection", (socket: any) => {
    console.log("Client connected");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("msg", (msg: any) => {
        console.log(msg);
    });
});

httpServer.listen(port, () => {
    console.log(`listening on *:${Constants.DEFAULT_PORT}`);
});

setTimeout(() => {
    const skt = socketioClient("http://localhost:9911");
    skt.emit("msg", "test");
}, 2000);
