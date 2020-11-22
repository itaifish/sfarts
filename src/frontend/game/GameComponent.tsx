import * as React from "react";
import Client from "../../client/client";

export interface GameComponentProps {
    client: Client;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameComponentState {
    hasEndedTurn: boolean;
}

class GameComponent extends React.Component<GameComponentProps, GameComponentState> {
    constructor(props: GameComponentProps) {
        super(props);
        this.state = { hasEndedTurn: false };
    }
    render() {
        return (
            <>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        this.props.client.setEndTurn(!this.state.hasEndedTurn);
                        this.setState({ hasEndedTurn: !this.state.hasEndedTurn });
                    }}
                >
                    {this.state.hasEndedTurn ? "Unend Turn" : "End Turn"}
                </button>
                <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                        this.props.client.resetMoves();
                    }}
                >
                    Reset Moves
                </button>
            </>
        );
    }
}

export default GameComponent;
