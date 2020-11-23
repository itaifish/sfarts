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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class LobbyListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lobbyList: [],
        };
        this.reloadLobbyList = this.reloadLobbyList.bind(this);
        this.interval = setInterval(this.reloadLobbyList, 5000);
    }
    reloadLobbyList() {
        const client = this.props.client;
        client.loadLobbyList(() => {
            this.setState({ lobbyList: client.lobbyList });
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return React.createElement(React.Fragment, null, " ");
    }
}
exports.default = LobbyListComponent;
//# sourceMappingURL=LobbyListComponent.js.map