import { ImageKeys } from "../scene/loginScreen";
import EditableText from "./editableText";

export default class InputButton {
    constructor(scene: Phaser.Scene, x: number, y: number, text?: string, inputType?: string) {
        const image = scene.add.image(x, y, ImageKeys.BUTTON);
        image.scale = 1.5; // rescale
        const editableText: any = new EditableText(scene, x - 105, y - 210, text, inputType);
        scene.add.existing(editableText);
    }
}
