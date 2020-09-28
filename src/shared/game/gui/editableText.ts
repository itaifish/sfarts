/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import TextEdit from "phaser3-rex-plugins/plugins/textedit-plugin";

export default class EditableText extends BBCodeText {
    edit: any;

    constructor(scene: any, x: number, y: number, text: string, style?: any) {
        super(scene, x, y, text, style || EditableText.getDefaultStyle());
        this.setInteractive();
        this.on("pointerdown", () => {
            this.edit = new TextEdit(this);
            console.log(`Text edit: ${JSON.stringify(this.edit)}`);
            //this.edit.(this.getDefaultConfig());
            console.log("I have been clicked");
        });
        scene.add.existing(this);
    }

    getDefaultConfig() {
        return {
            type: "text",
            text: this.text,
            onTextChanged: (textObject: EditableText, text: string) => {
                textObject.text = text;
                console.log("text has been changed");
            },
        };
    }

    static getDefaultStyle() {
        return {
            fontFamily: "Courier",
            fontSize: "16px",
            fontStyle: "",
            // backgroundColor: null,
            color: "#fff",
            stroke: "#fff",
            strokeThickness: 0,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: "#000",
                blur: 0,
                stroke: false,
                fill: false,
            },
            underline: {
                color: "#000",
                thinkness: 0,
                offset: 0,
            },
            // align: 'left',  // Equal to halign
            halign: "left", // 'left'|'center'|'right'
            valign: "top", // 'top'|'center'|'bottom'
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            maxLines: 0,
            lineSpacing: 0,
            fixedWidth: 0,
            fixedHeight: 0,
            testString: "|MÉqgy",
            wrap: {
                mode: "none", // 0|'none'|1|'word'|2|'char'|'character'
            },
            metrics: false,
        };
    }
}
