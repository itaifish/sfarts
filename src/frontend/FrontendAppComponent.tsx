import * as React from "react";
import Client from "../client/client";
import jquery from "jquery";
import "../../node_modules/bootstrap/dist/css/bootstrap.css";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FrontendAppComponentProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FrontendAppComponentState {
    client: Client;
}

class FrontendAppComponent extends React.Component<FrontendAppComponentProps, FrontendAppComponentState> {
    constructor(props: FrontendAppComponentProps) {
        super(props);
        this.state = {
            client: new Client(),
        };
        this.state.client.listen();
    }

    render() {
        return (
            <div>
                <div></div>
                {"Hello"}
            </div>
        );
    }
}

export default FrontendAppComponent;
