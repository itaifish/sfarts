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
class LobbyCreatorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                maxPlayersPerTeam: 1,
                numTeams: 2,
                turnTime: 0,
                mapId: "1",
                lobbyName: `${this.props.username}'s Lobby`,
            },
        };
        this.setLobbyName = this.setLobbyName.bind(this);
        this.setMapId = this.setMapId.bind(this);
    }
    setLobbyName(lobbyName) {
        this.setState((prevState, _props) => {
            return {
                settings: Object.assign(Object.assign({}, prevState.settings), { lobbyName: lobbyName }),
            };
        });
    }
    setMapId(mapId) {
        this.setState((prevState, _props) => {
            return {
                settings: Object.assign(Object.assign({}, prevState.settings), { mapId: mapId }),
            };
        });
    }
    render() {
        const maps = mapManager_1.default.getMaps();
        return (React.createElement("div", { className: "col-4 text-center justify-content-center", style: { backgroundColor: "white" } },
            React.createElement("form", { onSubmit: (event) => {
                    event.preventDefault();
                    this.props.createLobby(this.state.settings);
                } },
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "lobbyName" }, "Lobby Name:"),
                    React.createElement("input", { type: "text", id: "lobbyName", value: this.state.settings.lobbyName, className: "form-control", onChange: (event) => {
                            this.setLobbyName(event.target.value);
                        } })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "map" }, "Map:"),
                    React.createElement("select", { id: "map", value: this.state.settings.mapId, className: "form-control", onChange: (event) => {
                            this.setMapId(event.target.value);
                        } }, maps.map((map) => {
                        return (React.createElement("option", { key: map.id, value: map.id }, map.name));
                    }))),
                React.createElement("button", { className: "btn btn-primary", type: "submit", value: "Submit" }, "Create Lobby"))));
    }
}
exports.default = LobbyCreatorComponent;
//# sourceMappingURL=LobbyCreatorComponent.js.map