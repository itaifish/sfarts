import EditableText from "./editableText";

export default class InputButton {
    editableText: any;

    constructor(scene: Phaser.Scene, x: number, y: number, text?: string, inputType?: string) {
        const image = scene.add.image(x, y, "BUTTON");
        image.scale = 1.5; // rescale
        this.editableText = new EditableText(scene, x - 105, y - 240, text, inputType);
        scene.add.existing(this.editableText);
    }
}
