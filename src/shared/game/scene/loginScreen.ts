import Phaser from "phaser";
import Button from "../../../client/resources/images/button.svg";
import Background from "../../../client/resources/images/background.png";

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
        this.load.image(ImageKeys.BACKGROUND, Background);
    }

    create(): void {
        this.add.image(800, 450, ImageKeys.BACKGROUND);
        this.add.image(800, 540, ImageKeys.BUTTON);
    }

    static getSceneName(): string {
        return "LoginScreen";
    }
}
