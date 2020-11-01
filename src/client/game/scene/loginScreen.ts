import Phaser from "phaser";
import Button from "../../resources/images/button.svg";
import Background from "../../resources/images/background.png";
import InputButton from "../gui/inputButton";
import Client from "../../client";
import MessageEnum from "../../../shared/communication/messageEnum";
import { LoginMessageResponseType } from "../../../shared/communication/messageInterfaces/loginMessage";
import log, { LOG_LEVEL } from "../../../shared/utility/logger";
import LobbyScreen from "./lobbyScene";

export enum ImageKeys {
    BUTTON = "button",
    BACKGROUND = "background",
}

export default class LoginScreen extends Phaser.Scene {
    client: Client;
    usernameButton: InputButton;
    passwordButton: InputButton;

    constructor(client: Client) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: true,
        };
        super(config);
        this.client = client;
    }

    preload(): void {
        this.load.svg(ImageKeys.BUTTON, Button);
        this.load.image(ImageKeys.BACKGROUND, Background);
    }

    create(): void {
        this.add.image(800, 450, ImageKeys.BACKGROUND);
        this.usernameButton = new InputButton(this, 800, 540, "Username", "text");
        this.passwordButton = new InputButton(this, 800, 740, "Password", "password");
        const enterButton: Phaser.Input.Keyboard.Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        enterButton.on("down", (event: KeyboardEvent) => {
            this.client.addOnServerMessageCallback(MessageEnum.LOGIN, () => {
                if (this.client.loginStatus == LoginMessageResponseType.SUCCESS) {
                    // Go to next scene
                    log("Login Success", this.constructor.name, LOG_LEVEL.DEBUG);
                    this.scene.start(LobbyScreen.getSceneName());
                } else {
                    log("Login Failure", this.constructor.name, LOG_LEVEL.DEBUG);
                    // Clear password text
                    this.passwordButton.editableText.handleTextSubmit(this.passwordButton.editableText, "");
                }
            });
            const username: string = this.usernameButton.editableText.value;
            const password: string = this.passwordButton.editableText.value;
            this.client.sendLoginAttempt(username, password);
        });
    }

    static getSceneName(): string {
        return "LoginScreen";
    }
}
