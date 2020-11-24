import * as React from "react";
import MessageEnum from "../../shared/communication/messageEnum";
import Client from "../../client/client";
import log, { LOG_LEVEL } from "../../shared/utility/logger";

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
        this.updateEndTurn = this.updateEndTurn.bind(this);
        this.updateEndTurn();
    }

    componentDidMount() {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 1_000);
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 3_000);
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 10_000);
    }

    updateEndTurn() {
        this.props.client.addOnServerMessageCallback(MessageEnum.END_TURN_SIGNAL, () => {
            this.setState({ hasEndedTurn: false });
            log("Calling end turn", this.constructor.name, LOG_LEVEL.DEBUG);
        });
    }

    render() {
        return (
            <>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        this.updateEndTurn();
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
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                        this.props.client.concede();
                    }}
                >
                    Concede
                </button>
            </>
        );
    }
}

export default GameComponent;
