import gameBoard from "../gameBoard";
import PhaserGameUnit from "../units/phaserGameUnit";
import gameScene from "./gameScene";
export default class UI extends Phaser.Scene {
    width: number;
    height: number;
    board: gameBoard;
    theGame: gameScene;
    rect: Phaser.GameObjects.Rectangle;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    selectedX: number;
    selectedY: number;
    runInitFlag: boolean;
    unitSelected: PhaserGameUnit;
    theWord: Phaser.GameObjects.Text;

    constructor(width: number, height: number, theGame: gameScene) {
        const config: Phaser.Types.Scenes.SettingsConfig = {
            active: false,
        };
        super(config);
        this.width = width;
        this.height = height;
        this.theGame = theGame;
        this.runInitFlag = false;
    }
    preload() {}

    create() {
        // area where the UI is
        const mainWidth = this.cameras.main.width;
        const mainHeight = this.cameras.main.height;
        this.rect = this.add.rectangle(0, mainHeight, mainWidth * 2, mainHeight / 3, 0x6666ff);

        // defining the dimensions we are operating in
        this.minX = 0;
        this.minY = this.rect.getTopLeft().y;
        this.maxX = this.rect.getBottomRight().x;
        this.maxY = this.rect.getBottomRight().y;
        console.log(" minX = " + this.minX + " minY = " + this.minY + " maxX = " + this.maxX + " maxY = " + this.maxY);
        // add place for text
        this.theWord = this.add.text(this.minX, this.minY, "Hello World");
        this.theWord.setBackgroundColor("white");
        this.theWord.setColor("black");
        this.theWord.setFontSize(100);
    }

    update() {
        if (!this.runInitFlag && this.theGame.board) {
            this.runInitFlag = true;
            console.log("flag works");
            this.board = this.theGame.board;
            console.log(this.board);
            //process board here
            this.board.setInteractive().on("tiledown", (pointer: any, tileXY: any) => {
                this.displaySelect(tileXY);
            });
        }
    }

    displaySelect(tileXY: any) {
        console.log(tileXY);
        this.theWord.setText(tileXY.x + "," + tileXY.y);
        console.log(this.board.tileXYZToChess(tileXY.x, tileXY.y));
    }
}
