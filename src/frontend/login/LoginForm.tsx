import * as React from "react";
import './myStyle.css';
// import gametitle from url("gameTitle.PNG");

export interface LoginFormProps {
    sendLoginRequestFunc: (username: string, password: string) => void;
    sendCreateAccountRequestFunc: (username: string, password: string) => void;
}

export interface LoginFormState {
    username: string;
    password: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.handleLoginButton = this.handleLoginButton.bind(this);
        this.createAccountButton = this.createAccountButton.bind(this);
    }

    handleLoginButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            event.preventDefault();
            this.props.sendLoginRequestFunc(this.state.username, this.state.password);
            this.setState((prevState, _props) => ({ username: prevState.username, password: "" }));
        }
    }
    createAccountButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (this.state.username.length > 0 && this.state.password.length > 0) {
            event.preventDefault();
            this.props.sendCreateAccountRequestFunc(this.state.username, this.state.password);
            this.setState((prevState, _props) => ({ username: prevState.username, password: "" }));
        }
    }

    render() {
        return (
            <form>
                {/* <div  className="container">
                </div> */}
                <div className="form-group">
                    <label htmlFor="usernameInput">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usernameInput"
                        aria-describedby="usernameHelp"
                        placeholder="Enter username"
                        value={this.state.username}
                        onChange={(event) => {
                            this.setState({ username: event.target.value });
                        }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordInput">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(event) => {
                            this.setState({ password: event.target.value });
                        }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.handleLoginButton}>
                    Login
                </button>
                <button type="submit" className="btn btn-success" onClick={this.createAccountButton}>
                    Create Account
                </button>
            </form>
        );
    }
}

export default LoginForm;
