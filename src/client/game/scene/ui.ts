import gameBoard from "../gameBoard";
import PhaserGameUnit from "../units/phaserGameUnit";
import gameScene from "./gameScene";
import log from "../../../shared/utility/logger";
import Fighter from "../../resources/images/fighter.png";
import EnemyFighter from "../../resources/images/enemyfighter.png";
import Speeder from "../../resources/images/speeder.png";
import EnemySpeeder from "../../resources/images/enemyspeeder.png";
import Destroyer from "../../resources/images/destroyer.png";
import EnemyDestroyer from "../../resources/images/enemydestroyer.png";
import MainBase from "../../resources/images/mainbase.png";
import EnemyMainBase from "../../resources/images/mainbaseenemy.png";
import uiselector from "../../resources/images/uiselector.png";
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
    unitPictureMap: any;
    selectedUnitPicture: Phaser.GameObjects.Image;

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
        this.load.image("fighter1", Fighter);
        this.load.image("enemyFighter1", EnemyFighter);
        this.load.image("speeder1", Speeder);
        this.load.image("enemySpeeder1", EnemySpeeder);
        this.load.image("destroyer1", Destroyer);
        this.load.image("enemyDestroyer1", EnemyDestroyer);
        this.load.image("mainbase1", MainBase);
        this.load.image("enemyMainbase1", EnemyMainBase);
        this.load.image("UIbackground", uiselector);
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
        const uiBackground = this.add.image(350, this.minY, "UIbackground");
        uiBackground.scale = 1.75;
        this.theWord = this.add.text(300, this.minY - 90, "");
        this.theWord.setStroke("black", 2);
        this.rect.destroy();
        this.theWord.setColor("cyan");
        this.theWord.setFontSize(100);
        // making the pictures for the ui
        const fighterUnit1 = this.add.image(130, mainHeight - 150, "fighter1");
        fighterUnit1.setVisible(false);
        const enemyFighter1 = this.add.image(100, 100, "enemyFighter1");
        enemyFighter1.setVisible(false);
        const speeder1 = this.add.image(140, mainHeight - 160, "speeder1");
        speeder1.setVisible(false);
        const enemySpeeder1 = this.add.image(100, 100, "enemySpeeder1");
        enemySpeeder1.setVisible(false);
        const destroyer1 = this.add.image(140, mainHeight - 150, "destroyer1");
        destroyer1.setVisible(false);
        const enemyDestroyer1 = this.add.image(100, 100, "enemyDestroyer1");
        enemyDestroyer1.setVisible(false);
        const mainBase1 = this.add.image(130, mainHeight - 160, "mainbase1");
        mainBase1.setVisible(false);
        const enemyMainbase1 = this.add.image(130, mainHeight - 170, "enemyMainbase1");
        enemyMainbase1.setVisible(false);
        this.selectedUnitPicture = enemyDestroyer1;
        this.unitPictureMap = {
            fighter1: fighterUnit1,
            enemyFighter1: enemyFighter1,
            speeder1: speeder1,
            enemySpeeder1: enemySpeeder1,
            destroyer1: destroyer1,
            enemyDestroyer1: enemyDestroyer1,
            mainBase1: mainBase1,
            enemyMainbase1: enemyMainbase1,
        };
        Object.keys(this.unitPictureMap).forEach((element) => {
            this.unitPictureMap[element].scale = 2;
        });
    }

    update() {
        if (!this.runInitFlag && this.theGame.board) {
            this.runInitFlag = true;
            this.board = this.theGame.board;
            //process board here
            this.board.setInteractive().on("tiledown", (pointer: any, tileXY: any) => {
                this.displayStats();
                this.displayPicture();
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
        statSheet += "Health: " + health + "/" + maxHealth + "\n";
        statSheet += "Range: " + range + "\n";
        statSheet += "Damage: " + damage + "\n";
        statSheet +=
            "Ammo Remaining: " +
            (this.board.selected[1].gameUnit.specialMoves.length - this.board.selected[1].gameUnit.specialsUsed.length);

        this.theWord.setText(statSheet);
        this.theWord.setFont("30px Arial");
        this.board.selected[1].once("drawHealth", this.displayStats);
    }
    displayPicture() {
        this.selectedUnitPicture.setVisible(false);
        this.unitPictureMap[this.formatPicName(this.board.selected[1].gameUnit.name)].setVisible(true);
        this.selectedUnitPicture = this.unitPictureMap[this.formatPicName(this.board.selected[1].gameUnit.name)];
    }
    formatPicName(unitName: string) {
        let firstLetter = unitName.charAt(0);
        firstLetter = firstLetter.toLowerCase();
        const nameLength = unitName.length;
        const fileName = firstLetter + unitName.substring(1, nameLength - 4) + "1";
        return fileName;
    }
}
