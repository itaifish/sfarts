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
const mapManager_1 = __importDefault(require("../../shared/game/manager/mapManager"));
class LobbyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        var _a;
        const mapName = (_a = mapManager_1.default.getMaps().find((map) => {
            return map.id == this.props.lobby.settings.mapId;
        })) === null || _a === void 0 ? void 0 : _a.name;
        return (React.createElement(React.Fragment, null,
            React.createElement("tr", { className: this.props.joined ? "table-primary" : "", onClick: () => {
                    this.props.onClickJoin(this.props.index);
                } },
                React.createElement("th", { scope: "row" }, this.props.index + 1),
                React.createElement("td", null, this.props.lobby.settings.lobbyName),
                React.createElement("td", null,
                    this.props.lobby.players.length,
                    " / 2"),
                React.createElement("td", null, this.props.lobby.id),
                React.createElement("td", null, this.props.lobby.lobbyLeader),
                React.createElement("td", null, mapName))));
    }
}
exports.default = LobbyComponent;
//# sourceMappingURL=LobbyComponent.js.map