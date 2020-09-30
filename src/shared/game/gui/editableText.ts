/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import TextEdit from "phaser3-rex-plugins/plugins/textedit-plugin";

export default class EditableText extends BBCodeText {
    edit: any;
    inputType: string;
    placeholder: string;
    isPlaceHolder: boolean;

    constructor(scene: any, x: number, y: number, placeholder: string, inputType?: any) {
        super(scene, x, y, placeholder, EditableText.getDefaultStyle(true));
        this.setInteractive();
        this.inputType = inputType;
        const meInScene = scene.add.existing(this);
        this.placeholder = placeholder;
        this.isPlaceHolder = true;
        this.getDefaultConfig = this.getDefaultConfig.bind(this);
        this.on("pointerdown", () => {
            if (this.isPlaceHolder) {
                this.text = "";
                this.isPlaceHolder = false;
                this.setColor(EditableText.getDefaultStyle(false).color);
            }
            new TextEdit(scene.plugins).edit(meInScene, this.getDefaultConfig(), (textObject: EditableText) => {
                // Here, this does not exist in the lambda function, so we use textObject
                textObject.handleTextSubmit(textObject);
            });
        });
    }

    getDefaultConfig() {
        return {
            type: this.inputType || "text",
            text: this.text,
            onTextChanged: (textObject: EditableText, text: string) => {
                // Note that textObject == this
                this.handleTextSubmit(textObject, text);
            },
        };
    }

    handleTextSubmit(textObject: EditableText, text?: string) {
        // Note that textObject == this
        const existingText: string = text != null ? text : textObject.isPlaceHolder ? "" : textObject.text;
        if (existingText == "") {
            textObject.isPlaceHolder = true;
            textObject.text = textObject.placeholder;
        } else if (textObject.inputType == "password") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            textObject.text = [...existingText].reduce((acc, _currentVal) => acc + "•", "");
            textObject.isPlaceHolder = false;
        } else {
            textObject.text = existingText;
            textObject.isPlaceHolder = false;
        }
        textObject.setColor(EditableText.getDefaultStyle(textObject.isPlaceHolder).color);
    }

    static getDefaultStyle(isPlaceHolder: boolean) {
        return {
            color: isPlaceHolder ? "grey" : "white",
            fontSize: "30px",
            fixedWidth: 270,
            valign: "center",
            fixedHeight: 100,
        };
    }
}
