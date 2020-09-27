import Phaser from "phaser";
import Button from "../../../client/resources/images/button.svg";
import Background from "../../../client/resources/images/login_background.svg";

enum ImageKeys {
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
        this.load.svg(ImageKeys.BACKGROUND, Background);
    }

    create(): void {
        this.add.image(0, 0, ImageKeys.BACKGROUND);
        this.add.image(300, 300, ImageKeys.BUTTON);
    }

    static getSceneName(): string {
        return "LoginScreen";
    }
}
