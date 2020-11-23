"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const bbcodetext_1 = __importDefault(require("phaser3-rex-plugins/plugins/bbcodetext"));
const textedit_plugin_1 = __importDefault(require("phaser3-rex-plugins/plugins/textedit-plugin"));
class EditableText extends bbcodetext_1.default {
    constructor(scene, x, y, placeholder, inputType) {
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
            new textedit_plugin_1.default(scene.plugins).edit(meInScene, this.getDefaultConfig(), (textObject) => {
                // Here, this does not exist in the lambda function, so we use textObject
                textObject.handleTextSubmit(textObject);
            });
        });
        this.value = "";
    }
    getDefaultConfig() {
        return {
            type: this.inputType || "text",
            text: this.text,
            onTextChanged: (textObject, text) => {
                // Note that textObject == this
                this.handleTextSubmit(textObject, text);
            },
        };
    }
    handleTextSubmit(textObject, text) {
        // Note that textObject == this
        const existingText = text != null ? text : textObject.isPlaceHolder ? "" : textObject.text;
        if (existingText == "") {
            textObject.isPlaceHolder = true;
            textObject.text = textObject.placeholder;
            textObject.value = textObject.text;
        }
        else if (textObject.inputType == "password") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            textObject.text = [...existingText].reduce((acc, _currentVal) => acc + "•", "");
            textObject.isPlaceHolder = false;
            textObject.value = existingText;
        }
        else {
            textObject.text = existingText;
            textObject.isPlaceHolder = false;
            textObject.value = textObject.text;
        }
        textObject.setColor(EditableText.getDefaultStyle(textObject.isPlaceHolder).color);
    }
    static getDefaultStyle(isPlaceHolder) {
        return {
            color: isPlaceHolder ? "grey" : "white",
            fontSize: "30px",
            fixedWidth: 270,
            valign: "center",
            fixedHeight: 100,
        };
    }
}
exports.default = EditableText;
//# sourceMappingURL=editableText.js.map