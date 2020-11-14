import * as React from "react";
import Client from "../../client/client";
import Lobby from "../../server/room/lobby/lobby";
import client from "../../client/client";

export interface LobbyListComponentProps {
    client: Client;
}

export interface LobbyListComponentState {
    lobbyList: Lobby[];
}

class LobbyListComponent extends React.Component<LobbyListComponentProps, LobbyListComponentState> {
    interval: NodeJS.Timeout;
    constructor(props: LobbyListComponentProps) {
        super(props);
        this.state = {
            lobbyList: [],
        };
        this.reloadLobbyList = this.reloadLobbyList.bind(this);
        this.interval = setInterval(this.reloadLobbyList, 5_000);
    }

    reloadLobbyList() {
        const client = this.props.client;
        client.loadLobbyList(() => {
            this.setState({ lobbyList: client.lobbyList });
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <> </>;
    }
}

export default LobbyListComponent;
