/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import TextEdit from "phaser3-rex-plugins/plugins/textedit-plugin";

export default class EditableText extends BBCodeText {
    edit: any;
    inputType: string;
    innerText: string;

    constructor(scene: any, x: number, y: number, text: string, inputType?: any) {
        super(scene, x, y, text, EditableText.getDefaultStyle());
        this.setInteractive();
        this.inputType = inputType;
        const meInScene = scene.add.existing(this);
        this.on("pointerdown", () => {
            if (this.innerText == "") {
                this.text = "\n";
            }
            debugger;
            new TextEdit(scene.plugins).edit(meInScene, this.getDefaultConfig(), (textObject: EditableText) => {});
        });
    }

    getDefaultConfig() {
        return {
            type: this.inputType || "text",
            text: this.text,
            onTextChanged: (textObject: EditableText, text: string) => {
                this.innerText = text;
                debugger;
                if (text == "") {
                    textObject.text = "\n";
                } else if (this.inputType == "password") {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    textObject.text = [...text].reduce((acc, _currentVal) => acc + "*", "");
                } else {
                    textObject.text = text;
                }
            },
        };
    }

    static getDefaultStyle() {
        return {
            color: "white",
            fontSize: "30px",
            fixedWidth: 270,
        };
    }
}
