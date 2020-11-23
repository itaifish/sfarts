import * as React from "react";
import Client from "../../client/client";
import MessageEnum from "../../shared/communication/messageEnum";
import LobbyComponent from "./LobbyComponent";
import { ClientLobby } from "../../shared/communication/messageInterfaces/lobbyMessage";
import LobbyCreatorComponent from "./LobbyCreatorComponent";
import LobbySettings from "../../server/room/lobby/lobbySettings";

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
        this.createLobby = this.createLobby.bind(this);
        this.interval = setInterval(this.reloadLobbyList, 2_000);
    }

    reloadLobbyList() {
        this.props.client.loadLobbyList(this.reloadState);
    }

    reloadState() {
        this.setState({ lobbyList: this.props.client.lobbyList });
    }

    createLobby(settings: LobbySettings) {
        this.props.client.createLobby(settings);
        this.props.client.addOnServerMessageCallback(MessageEnum.GET_LOBBIES, this.reloadState);
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

    lobbyButton(lobbyIndex: number) {
        const lobby = this.props.client.lobbyList[lobbyIndex];
        const emptyTeam = parseInt(
            Object.keys(lobby.playerTeamMap).find((teamId) => {
                const teamIdNumber = parseInt(teamId);
                return Object.keys(lobby.playerTeamMap[teamIdNumber]).length == 0;
            }),
        );
        this.props.client.joinLobby(lobby.id, emptyTeam || 0, this.reloadState);
    }

    render() {
        const myLobbyIdx = this.props.client.lobbyList.findIndex((value, index) => {
            return value.players.includes(this.props.client.userId);
        });
        const buttonJSX = (
            <>
                {myLobbyIdx != -1 ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            this.props.client.leaveLobby(this.props.client.lobbyList[myLobbyIdx].id, this.reloadState);
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
                {this.props.client?.lobbyList[myLobbyIdx]?.lobbyLeader == this.props.client.userId &&
                this.props.client?.lobbyList[myLobbyIdx].players.length > 1 ? (
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
        this.state.lobbyList.forEach((lobby, index) => {
            lobbiesJSX.push(
                <LobbyComponent
                    lobby={lobby}
                    key={index}
                    joined={index == myLobbyIdx}
                    index={index}
                    onClickJoin={this.lobbyButton}
                />,
            );
        });
        return (
            <>
                {buttonJSX}
                {startGameJsx}
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Players</th>
                            <th scope="col">ID</th>
                            <th scope="col">Manager</th>
                            <th scope="col">Map</th>
                        </tr>
                    </thead>
                    <tbody>{lobbiesJSX}</tbody>
                </table>
                <div className="fixed-bottom">
                    <LobbyCreatorComponent username={this.props.client.userId + ""} createLobby={this.createLobby} />
                </div>
            </>
        );
    }
}

export default LobbyListComponent;
