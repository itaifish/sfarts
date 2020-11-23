import gameBoard from "../gameBoard";
import PhaserGameUnit from "../units/phaserGameUnit";
import gameScene from "./gameScene";
import log from "../../../shared/utility/logger";
import Fighter from "../../resources/images/fighter.png";
import EnemyFighter from "../../resources/images/enemyfighter.png";
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
        this.displayStats = this.displayStats.bind(this);
    }
    preload() {
        this.load.image("fighter", Fighter);
        this.load.image("enemyFighter", EnemyFighter);
    }

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
        this.rect.destroy();
        // add place for text
        this.theWord = this.add.text(this.minX, this.minY - 100, "");
        this.rect.destroy();
        this.theWord.setBackgroundColor("white");
        this.theWord.setColor("black");
        this.theWord.setFontSize(100);
    }

    update() {
        if (!this.runInitFlag && this.theGame.board) {
            this.runInitFlag = true;
            this.board = this.theGame.board;
            //process board here
            this.board.setInteractive().on("tiledown", (pointer: any, tileXY: any) => {
                this.displayStats();
            });
        }
    }

    displayStats() {
        const stats = this.board.selected[1].gameUnit.unitStats;
        const speed = stats.moveSpeed;
        const movesRemaining = stats.movesRemaining;
        const maxHealth = stats.maxHealth;
        const health = stats.health;
        const range = stats.range;
        const damage = stats.damage;
        let statSheet = "Energy: " + movesRemaining.toString() + "/" + speed.toString() + "\n";
        statSheet += "Health: " + maxHealth + "/" + health + "\n";
        statSheet += "Range: " + range + "\n";
        statSheet += "Damage: " + damage + "\n";
        if (this.board.selected[1].gameUnit.specialsUsed.length > 0) {
            statSheet += "Ammo Remaining: " + 0;
        } else {
            statSheet += "Ammo Remaining: " + 1;
        }

        this.theWord.setText(statSheet);
        this.theWord.setFont("30px Arial");
        this.board.selected[1].once("drawHealth", this.displayStats);
    }
}
