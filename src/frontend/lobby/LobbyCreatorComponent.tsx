import * as React from "react";
import LobbySettings from "../../server/room/lobby/lobbySettings";
import MapManager from "../../shared/game/manager/mapManager";

export interface LobbyCreatorComponentProps {
    username: string;
}

export interface LobbyCreatorComponentState {
    settings: LobbySettings;
}

class LobbyCreatorComponent extends React.Component<LobbyCreatorComponentProps, LobbyCreatorComponentState> {
    constructor(props: LobbyCreatorComponentProps) {
        super(props);
        this.state = {
            settings: {
                maxPlayersPerTeam: 1,
                numTeams: 2,
                turnTime: 0,
                mapId: "1",
                lobbyName: `${this.props.username}'s Lobby`,
            },
        };
    }
    render() {
        const maps = MapManager.getMaps();
        return <></>;
    }
}

export default LobbyCreatorComponent;
