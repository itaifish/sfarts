import * as React from "react";
import { ClientLobby } from "../../shared/communication/messageInterfaces/lobbyMessage";

export interface LobbyComponentProps {
    lobby: ClientLobby;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LobbyComponentState {}

class LobbyComponent extends React.Component<LobbyComponentProps, LobbyComponentState> {
    constructor(props: LobbyComponentProps) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <>
                <tr>
                    <th scope="row">1</th>
                    <td>{this.props.lobby.settings.lobbyName}</td>
                    <td>{this.props.lobby.players.length}</td>
                    <td>{this.props.lobby.id}</td>
                </tr>
            </>
        );
    }
}

export default LobbyComponent;
