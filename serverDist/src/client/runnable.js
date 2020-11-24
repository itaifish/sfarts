"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tbsfartsGame_1 = __importDefault(require("./game/tbsfartsGame"));
const client_1 = __importDefault(require("./client"));
const startClient = () => {
    const client = new client_1.default();
    client.listen();
    new tbsfartsGame_1.default(client);
};
startClient();
//# sourceMappingURL=runnable.js.map