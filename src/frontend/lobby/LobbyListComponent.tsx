import * as React from "react";
import Client from "../../client/client";
import MessageEnum from "../../shared/communication/messageEnum";
import LobbyComponent from "./LobbyComponent";
import { ClientLobby } from "../../shared/communication/messageInterfaces/lobbyMessage";

export interface LobbyListComponentProps {
    client: Client;
}

export interface LobbyListComponentState {
    lobbyList: ClientLobby[];
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

    componentDidMount() {
        this.reloadLobbyList();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const buttonJSX = (
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                    this.props.client.createLobby({
                        maxPlayersPerTeam: 1,
                        numTeams: 2,
                        turnTime: 30,
                        lobbyName: "bitches and hoes",
                        mapId: "mapId",
                    });
                    this.props.client.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, () => {
                        this.setState({ lobbyList: this.props.client.lobbyList });
                    });
                }}
            >
                Create Lobby
            </button>
        );
        const lobbiesJSX: JSX.Element[] = [];
        this.state.lobbyList.forEach((lobby) => {
            lobbiesJSX.push(<LobbyComponent lobby={lobby} key={lobby.id} />);
        });
        return (
            <>
                {buttonJSX}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Lobby Name</th>
                            <th scope="col">Number of players connected</th>
                            <th scope="col">4</th>
                        </tr>
                    </thead>
                    <tbody>{lobbiesJSX}</tbody>
                </table>
            </>
        );
    }
}

export default LobbyListComponent;
