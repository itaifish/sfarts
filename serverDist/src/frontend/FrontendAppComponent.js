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
const LobbyListComponent_1 = __importDefault(require("./lobby/LobbyListComponent"));
const GameComponent_1 = __importDefault(require("./game/GameComponent"));
class FrontendAppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: new client_1.default(),
            username: null,
            errorMessage: null,
            successMessage: null,
            game: null,
        };
        this.state.client.listen();
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.handleCreateAccountButton = this.handleCreateAccountButton.bind(this);
        this.gameHasLoaded = this.gameHasLoaded.bind(this);
    }
    handleLoginButton(username, password) {
        if (!this.state.game) {
            const client = this.state.client;
            client.addOnServerMessageCallback(messageEnum_1.default.LOGIN, () => {
                if (client.loginStatus == loginMessage_1.LoginMessageResponseType.SUCCESS) {
                    this.setState({ username: username, errorMessage: null });
                    console.log("login successful");
                    // if successful gamestate sent over
                    if (this.state.client.gameManager) {
                        this.gameHasLoaded();
                    }
                }
                else {
                    this.setState({
                        errorMessage: "Username or password is incorrect",
                        successMessage: null,
                    });
                }
            });
            client.addOnServerMessageCallback(messageEnum_1.default.GAME_HAS_ENDED, () => {
                this.state.game.destroy(true);
                this.setState({ game: null });
                alert(`The Game is over: ${client.gameOverWinner} has won`);
            });
            client.sendLoginAttempt(username, password);
        }
    }
    handleCreateAccountButton(username, password) {
        const client = this.state.client;
        client.createAccount(username, password, () => {
            if (client.loginStatus == loginMessage_1.LoginMessageResponseType.SUCCESS) {
                this.setState({ successMessage: "Account has been successfully created", errorMessage: null });
            }
            else {
                this.setState({ errorMessage: "Username is taken", successMessage: null });
            }
        });
    }
    gameHasLoaded() {
        this.setState({ game: new tbsfartsGame_1.default(this.state.client) });
    }
    render() {
        const loginJSX = (React.createElement("div", { className: "col-6 text-center", style: { backgroundColor: "white" } },
            React.createElement(LoginForm_1.default, { sendLoginRequestFunc: this.handleLoginButton, sendCreateAccountRequestFunc: this.handleCreateAccountButton }),
            this.state.errorMessage ? React.createElement("div", { style: { color: "red" } }, this.state.errorMessage) : React.createElement(React.Fragment, null),
            this.state.successMessage ? React.createElement("div", { style: { color: "green" } }, this.state.successMessage) : React.createElement(React.Fragment, null)));
        return (React.createElement("div", { className: "container-fluid" },
            React.createElement("div", { className: "row justify-content-center" }, !this.state.username ? (loginJSX) : !this.state.game ? (React.createElement("div", { style: { backgroundColor: "white" } },
                React.createElement(LobbyListComponent_1.default, { client: this.state.client, gameHasLoadedCallback: this.gameHasLoaded, username: this.state.username }))) : (
            //Game holder stuff goes here
            React.createElement(GameComponent_1.default, { client: this.state.client })))));
    }
}
exports.default = FrontendAppComponent;
//# sourceMappingURL=FrontendAppComponent.js.map