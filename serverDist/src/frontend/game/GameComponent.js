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
const logger_1 = __importStar(require("../../shared/utility/logger"));
class GameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasEndedTurn: false };
        this.updateEndTurn = this.updateEndTurn.bind(this);
        this.updateEndTurn();
    }
    componentDidMount() {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
            document.body.requestFullscreen();
        }, 2000);
    }
    updateEndTurn() {
        this.props.client.addOnServerMessageCallback(messageEnum_1.default.END_TURN_SIGNAL, () => {
            this.setState({ hasEndedTurn: false });
            logger_1.default("Calling end turn", this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
        });
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { type: "button", className: "btn btn-primary", onClick: () => {
                    this.updateEndTurn();
                    this.props.client.setEndTurn(!this.state.hasEndedTurn);
                    this.setState({ hasEndedTurn: !this.state.hasEndedTurn });
                } }, this.state.hasEndedTurn ? "Unend Turn" : "End Turn"),
            React.createElement("button", { type: "button", className: "btn btn-warning", onClick: () => {
                    this.props.client.resetMoves();
                } }, "Reset Moves"),
            React.createElement("button", { type: "button", className: "btn btn-danger", onClick: () => {
                    this.props.client.concede();
                } }, "Concede")));
    }
}
exports.default = GameComponent;
//# sourceMappingURL=GameComponent.js.map