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
const React = __importStar(require("react"));
const client_1 = __importDefault(require("../client/client"));
require("../../node_modules/bootstrap/dist/css/bootstrap.css");
const LoginForm_1 = __importDefault(require("./login/LoginForm"));
const messageEnum_1 = __importDefault(require("../shared/communication/messageEnum"));
const loginMessage_1 = require("../shared/communication/messageInterfaces/loginMessage");
const tbsfartsGame_1 = __importDefault(require("../client/game/tbsfartsGame"));
class FrontendAppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: new client_1.default(),
            username: null,
            errorMessage: null,
        };
        this.state.client.listen();
        this.handleLoginButton = this.handleLoginButton.bind(this);
    }
    handleLoginButton(username, password) {
        const client = this.state.client;
        client.addOnServerMessageCallback(messageEnum_1.default.LOGIN, () => {
            if (client.loginStatus == loginMessage_1.LoginMessageResponseType.SUCCESS) {
                this.setState({ username: username, errorMessage: null });
                console.log("login successful");
                const game = new tbsfartsGame_1.default(client);
            }
            else {
                this.setState({ errorMessage: "Username or password is incorrect" });
            }
        });
        client.sendLoginAttempt(username, password);
    }
    render() {
        const loginJSX = (React.createElement("div", { className: "col-6 text-center" },
            React.createElement(LoginForm_1.default, { sendLoginRequestFunc: this.handleLoginButton }),
            this.state.errorMessage ? React.createElement("div", { style: { color: "red" } }, this.state.errorMessage) : React.createElement(React.Fragment, null)));
        return (React.createElement("div", { className: "container-fluid" },
            React.createElement("div", { className: "row justify-content-center" }, loginJSX)));
    }
}
exports.default = FrontendAppComponent;
//# sourceMappingURL=FrontendAppComponent.js.map