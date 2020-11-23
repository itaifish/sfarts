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
const messageEnum_1 = __importDefault(require("../../shared/communication/messageEnum"));
const LobbyComponent_1 = __importDefault(require("./LobbyComponent"));
const LobbyCreatorComponent_1 = __importDefault(require("./LobbyCreatorComponent"));
class LobbyListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lobbyList: [],
            stats: null,
        };
        this.reloadLobbyListAndStats = this.reloadLobbyListAndStats.bind(this);
        this.lobbyButton = this.lobbyButton.bind(this);
        this.reloadState = this.reloadState.bind(this);
        this.createLobby = this.createLobby.bind(this);
        this.interval = setInterval(this.reloadLobbyListAndStats, 4000);
    }
    reloadLobbyListAndStats() {
        this.props.client.loadLobbyList(this.reloadState);
        this.props.client.getServerStats(() => {
            this.setState({ stats: this.props.client.stats });
        });
    }
    reloadState() {
        this.setState({ lobbyList: this.props.client.lobbyList });
    }
    createLobby(settings) {
        this.props.client.createLobby(settings);
        this.props.client.addOnServerMessageCallback(messageEnum_1.default.GET_LOBBIES, this.reloadState);
    }
    componentDidMount() {
        this.reloadLobbyListAndStats();
        this.props.client.addOnServerMessageCallback(messageEnum_1.default.START_GAME, () => {
            this.props.gameHasLoadedCallback();
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    lobbyButton(lobbyIndex) {
        const lobby = this.props.client.lobbyList[lobbyIndex];
        const emptyTeam = parseInt(Object.keys(lobby.playerTeamMap).find((teamId) => {
            const teamIdNumber = parseInt(teamId);
            return Object.keys(lobby.playerTeamMap[teamIdNumber]).length == 0;
        }));
        this.props.client.joinLobby(lobby.id, emptyTeam || 0, this.reloadState);
    }
    render() {
        var _a, _b, _c;
        const myLobbyIdx = this.props.client.lobbyList.findIndex((value, index) => {
            return value.players.includes(this.props.client.userId);
        });
        const buttonJSX = (React.createElement(React.Fragment, null, myLobbyIdx != -1 ? (React.createElement("button", { type: "button", className: "btn btn-primary", onClick: () => {
                this.props.client.leaveLobby(this.props.client.lobbyList[myLobbyIdx].id, this.reloadState);
            } }, "Leave Lobby")) : (React.createElement(React.Fragment, null))));
        const startGameJsx = (React.createElement(React.Fragment, null,
            ((_b = (_a = this.props.client) === null || _a === void 0 ? void 0 : _a.lobbyList[myLobbyIdx]) === null || _b === void 0 ? void 0 : _b.lobbyLeader) == this.props.client.userId &&
                ((_c = this.props.client) === null || _c === void 0 ? void 0 : _c.lobbyList[myLobbyIdx].players.length) > 1 ? (React.createElement("button", { type: "button", className: "btn btn-success", onClick: () => {
                    this.props.client.startGame();
                } }, "Start Game")) : (React.createElement(React.Fragment, null, " ")),
            " "));
        const lobbiesJSX = [];
        this.state.lobbyList.forEach((lobby, index) => {
            lobbiesJSX.push(React.createElement(LobbyComponent_1.default, { lobby: lobby, key: index, joined: index == myLobbyIdx, index: index, onClickJoin: this.lobbyButton }));
        });
        const statsJsx = this.state.stats ? (React.createElement("div", { className: "col" },
            React.createElement("div", { className: "alert alert-success", role: "alert", style: { backgroundColor: "white" } },
                "Welcome, ",
                this.state.stats.username,
                "! There are currently ",
                this.state.stats.numberOfLobbies,
                " lobbies available and ",
                this.state.stats.numberOfGames,
                " games being played"))) : (React.createElement(React.Fragment, null));
        return (React.createElement(React.Fragment, null,
            statsJsx,
            buttonJSX,
            startGameJsx,
            React.createElement("table", { className: "table table-bordered table-hover" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { scope: "col" }, "#"),
                        React.createElement("th", { scope: "col" }, "Name"),
                        React.createElement("th", { scope: "col" }, "Players"),
                        React.createElement("th", { scope: "col" }, "ID"),
                        React.createElement("th", { scope: "col" }, "Manager"),
                        React.createElement("th", { scope: "col" }, "Map"))),
                React.createElement("tbody", null, lobbiesJSX)),
            React.createElement("div", { className: "fixed-bottom" },
                React.createElement(LobbyCreatorComponent_1.default, { username: this.props.username, createLobby: this.createLobby }))));
    }
}
exports.default = LobbyListComponent;
//# sourceMappingURL=LobbyListComponent.js.map