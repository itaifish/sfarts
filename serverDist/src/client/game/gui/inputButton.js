"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const editableText_1 = __importDefault(require("./editableText"));
class InputButton {
    constructor(scene, x, y, text, inputType) {
        const image = scene.add.image(x, y, "BUTTON");
        image.scale = 1.5; // rescale
        this.editableText = new editableText_1.default(scene, x - 105, y - 240, text, inputType);
        scene.add.existing(this.editableText);
    }
}
exports.default = InputButton;
//# sourceMappingURL=inputButton.js.map