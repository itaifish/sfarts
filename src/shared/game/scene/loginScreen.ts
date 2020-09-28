import Phaser from "phaser";
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import Button from "../../../client/resources/images/button.svg";
import Background from "../../../client/resources/images/background.png";
import EditableText from "../gui/editableText";

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
        // this.add.image(800, 450, ImageKeys.BACKGROUND);
        this.add.image(800, 540, ImageKeys.BUTTON);
        //const text = new BBCodeText(this, 800, 540, "Username");
        //console.log(`BBCode Text Object: ${JSON.stringify(text)}`);
        const text: any = new EditableText(this, 800, 540, "Username");
        this.add.existing(text);
    }

    static getSceneName(): string {
        return "LoginScreen";
    }
}
