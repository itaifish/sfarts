import * as React from "react";
import Client from "../client/client";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import LoginForm from "./login/LoginForm";
import MessageEnum from "../shared/communication/messageEnum";
import { LoginMessageResponseType } from "../shared/communication/messageInterfaces/loginMessage";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FrontendAppComponentProps {}

export interface FrontendAppComponentState {
    client: Client;
    username: string;
    errorMessage: string;
}

class FrontendAppComponent extends React.Component<FrontendAppComponentProps, FrontendAppComponentState> {
    constructor(props: FrontendAppComponentProps) {
        super(props);
        this.state = {
            client: new Client(),
            username: null,
            errorMessage: null,
        };
        this.state.client.listen();

        this.handleLoginButton = this.handleLoginButton.bind(this);
    }

    handleLoginButton(username: string, password: string) {
        const client = this.state.client;
        client.addOnServerMessageCallback(MessageEnum.LOGIN, () => {
            if (client.loginStatus == LoginMessageResponseType.SUCCESS) {
                this.setState({ username: username, errorMessage: null });
                console.log("login successful");
            } else {
                this.setState({ errorMessage: "Username or password is incorrect" });
            }
        });
        client.sendLoginAttempt(username, password);
    }

    render() {
        const loginJSX = (
            <div className="col text-center">
                <LoginForm sendLoginRequestFunc={this.handleLoginButton} />
                {this.state.errorMessage ? <div style={{ color: "red" }}>{this.state.errorMessage}</div> : <></>}
            </div>
        );
        return (
            <div className="container-fluid">
                <div className="row">{loginJSX}</div>
            </div>
        );
    }
}

export default FrontendAppComponent;
