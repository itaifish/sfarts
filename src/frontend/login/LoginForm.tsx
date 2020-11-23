import * as React from "react";
import './myStyle.css';

export interface LoginFormProps {
    sendLoginRequestFunc: (username: string, password: string) => void;
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
    }

    handleLoginButton(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        this.props.sendLoginRequestFunc(this.state.username, this.state.password);
    }

    render() {
        return (
            <form>
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
            </form>
        );
    }
}

export default LoginForm;
