import Phaser from "phaser";
import Button from "../../resources/images/button.svg";
import Background from "../../resources/images/background.png";
import InputButton from "../gui/inputButton";

export enum ImageKeys {
    BUTTON = "button",
    BACKGROUND = "background",
}

export default class LoginScreen extends Phaser.Scene {
    constructor() {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: true,
        };
        super(config);
    }

    preload(): void {
        this.load.svg(ImageKeys.BUTTON, Button);
        this.load.image(ImageKeys.BACKGROUND, Background);
    }

    create(): void {
        this.add.image(800, 450, ImageKeys.BACKGROUND);
        new InputButton(this, 800, 540, "Username", "text");
        new InputButton(this, 800, 740, "Password", "password");
    }

    static getSceneName(): string {
        return "LoginScreen";
    }
}
