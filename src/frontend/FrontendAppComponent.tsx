import * as React from "react";
import Client from "../client/client";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import LoginForm from "./login/LoginForm";
import MessageEnum from "../shared/communication/messageEnum";
import { LoginMessageResponseType } from "../shared/communication/messageInterfaces/loginMessage";
import TbsfartsGame from "../client/game/tbsfartsGame";
import LobbyListComponent from "./lobby/LobbyListComponent";
import GameComponent from "./game/GameComponent";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FrontendAppComponentProps {}

export interface FrontendAppComponentState {
    client: Client;
    username: string;
    errorMessage: string;
    game: TbsfartsGame;
}

class FrontendAppComponent extends React.Component<FrontendAppComponentProps, FrontendAppComponentState> {
    constructor(props: FrontendAppComponentProps) {
        super(props);
        this.state = {
            client: new Client(),
            username: null,
            errorMessage: null,
            game: null,
        };
        this.state.client.listen();

        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.gameHasLoaded = this.gameHasLoaded.bind(this);
    }

    handleLoginButton(username: string, password: string): void {
        if (!this.state.game) {
            const client = this.state.client;
            client.addOnServerMessageCallback(MessageEnum.LOGIN, () => {
                if (client.loginStatus == LoginMessageResponseType.SUCCESS) {
                    this.setState({ username: username, errorMessage: null });
                    console.log("login successful");
                    // if successful gamestate sent over
                    if (this.state.client.gameManager) {
                        this.gameHasLoaded();
                    }
                } else {
                    this.setState({ errorMessage: "Username or password is incorrect" });
                }
            });
            client.addOnServerMessageCallback(MessageEnum.GAME_HAS_ENDED, () => {
                this.state.game.destroy(true);
                this.setState({ game: null });
                alert(`The Game is over: ${client.gameOverWinner} has won`);
            });
            client.sendLoginAttempt(username, password);
        }
    }

    gameHasLoaded(): void {
        this.setState({ game: new TbsfartsGame(this.state.client) });
    }

    render(): JSX.Element {
        const loginJSX = (
            <div className="col-6 text-center" style={{ backgroundColor: "white" }}>
                <LoginForm sendLoginRequestFunc={this.handleLoginButton} />
                {this.state.errorMessage ? <div style={{ color: "red" }}>{this.state.errorMessage}</div> : <></>}
            </div>
        );
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    {!this.state.username ? (
                        loginJSX
                    ) : !this.state.game ? (
                        <div style={{ backgroundColor: "white" }}>
                            <LobbyListComponent client={this.state.client} gameHasLoadedCallback={this.gameHasLoaded} />
                        </div>
                    ) : (
                        //Game holder stuff goes here
                        <GameComponent client={this.state.client} />
                    )}
                </div>
            </div>
        );
    }
}

export default FrontendAppComponent;
