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
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.createAccountButton = this.createAccountButton.bind(this);
    }
    handleLoginButton(event) {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            event.preventDefault();
            this.props.sendLoginRequestFunc(this.state.username, this.state.password);
            this.setState((prevState, _props) => ({ username: prevState.username, password: "" }));
        }
    }
    createAccountButton(event) {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            event.preventDefault();
            this.props.sendCreateAccountRequestFunc(this.state.username, this.state.password);
            this.setState((prevState, _props) => ({ username: prevState.username, password: "" }));
        }
    }
    render() {
        return (React.createElement("form", { onSubmit: (event) => {
                event.preventDefault();
            } },
            React.createElement("div", { className: "form-group" },
                React.createElement("label", { htmlFor: "usernameInput" }, "Username"),
                React.createElement("input", { type: "text", className: "form-control", id: "usernameInput", "aria-describedby": "usernameHelp", placeholder: "Enter username", value: this.state.username, onChange: (event) => {
                        this.setState({ username: event.target.value });
                    } })),
            React.createElement("div", { className: "form-group" },
                React.createElement("label", { htmlFor: "passwordInput" }, "Password"),
                React.createElement("input", { type: "password", className: "form-control", id: "passwordInput", placeholder: "Password", value: this.state.password, onChange: (event) => {
                        this.setState({ password: event.target.value });
                    } })),
            React.createElement("button", { type: "submit", className: "btn btn-primary", onClick: this.handleLoginButton }, "Login"),
            React.createElement("button", { type: "submit", className: "btn btn-success", onClick: this.createAccountButton }, "Create Account")));
    }
}
exports.default = LoginForm;
//# sourceMappingURL=LoginForm.js.map