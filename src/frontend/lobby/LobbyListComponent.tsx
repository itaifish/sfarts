import * as React from "react";
import Client from "../../client/client";
import MessageEnum from "../../shared/communication/messageEnum";
import LobbyComponent from "./LobbyComponent";
import { ClientLobby } from "../../shared/communication/messageInterfaces/lobbyMessage";

export interface LobbyListComponentProps {
    client: Client;
    gameHasLoadedCallback: () => void;
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
        this.lobbyButton = this.lobbyButton.bind(this);
        this.reloadState = this.reloadState.bind(this);
        this.interval = setInterval(this.reloadLobbyList, 2_000);
    }

    reloadLobbyList() {
        this.props.client.loadLobbyList(this.reloadState);
    }

    reloadState() {
        this.setState({ lobbyList: this.props.client.lobbyList });
    }

    componentDidMount() {
        this.reloadLobbyList();
        this.props.client.addOnServerMessageCallback(MessageEnum.START_GAME, () => {
            this.props.gameHasLoadedCallback();
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    lobbyButton() {
        if (this.props.client.lobbyList.length == 0) {
            this.props.client.createLobby({
                maxPlayersPerTeam: 1,
                numTeams: 2,
                turnTime: 30_000, //30 seconds
                lobbyName: prompt("Please enter a lobby name: ", "new lobby"),
                mapId: "mapId",
            });
            this.props.client.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, this.reloadState);
        } else {
            const lobby = this.props.client.lobbyList[0];
            const emptyTeam = parseInt(
                Object.keys(lobby.playerTeamMap).find((teamId) => {
                    const teamIdNumber = parseInt(teamId);
                    return Object.keys(lobby.playerTeamMap[teamIdNumber]).length == 0;
                }),
            );
            this.props.client.joinLobby(lobby.id, emptyTeam || 0, this.reloadState);
        }
    }

    render() {
        const buttonJSX = (
            <>
                <button type="button" className="btn btn-primary" onClick={this.lobbyButton}>
                    {this.props.client.lobbyList.length == 0 ? "Create Lobby" : "Join Lobby"}
                </button>
                {this.props.client.lobbyList.length != 0 ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            const lobby = this.props.client.lobbyList[0];
                            this.props.client.leaveLobby(this.props.client.lobbyList[0].id, this.reloadState);
                        }}
                    >
                        Leave Lobby
                    </button>
                ) : (
                    <></>
                )}
            </>
        );
        const startGameJsx = (
            <>
                {" "}
                {this.props.client?.lobbyList[0]?.lobbyLeader == this.props.client.userId ? (
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            this.props.client.startGame();
                        }}
                    >
                        Start Game
                    </button>
                ) : (
                    <> </>
                )}{" "}
            </>
        );
        const lobbiesJSX: JSX.Element[] = [];
        this.state.lobbyList.forEach((lobby) => {
            lobbiesJSX.push(<LobbyComponent lobby={lobby} key={lobby.id} />);
        });
        return (
            <>
                {buttonJSX}
                {startGameJsx}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Lobby Name</th>
                            <th scope="col">No. Players Connected</th>
                            <th scope="col">Lobby ID</th>
                            <th scope="col">Lobby Manager</th>
                        </tr>
                    </thead>
                    <tbody>{lobbiesJSX}</tbody>
                </table>
            </>
        );
    }
}

export default LobbyListComponent;
