"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fighter_png_1 = __importDefault(require("../../resources/images/fighter.png"));
const enemyfighter_png_1 = __importDefault(require("../../resources/images/enemyfighter.png"));
const speeder_png_1 = __importDefault(require("../../resources/images/speeder.png"));
const enemyspeeder_png_1 = __importDefault(require("../../resources/images/enemyspeeder.png"));
const destroyer_png_1 = __importDefault(require("../../resources/images/destroyer.png"));
const enemydestroyer_png_1 = __importDefault(require("../../resources/images/enemydestroyer.png"));
const uiselector_png_1 = __importDefault(require("../../resources/images/uiselector.png"));
class UI extends Phaser.Scene {
    constructor(width, height, theGame) {
        const config = {
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
        this.load.image("fighter1", fighter_png_1.default);
        this.load.image("enemyFighter1", enemyfighter_png_1.default);
        this.load.image("speeder1", speeder_png_1.default);
        this.load.image("enemySpeeder1", enemyspeeder_png_1.default);
        this.load.image("destroyer1", destroyer_png_1.default);
        this.load.image("enemyDestroyer1", enemydestroyer_png_1.default);
        this.load.image("UIbackground", uiselector_png_1.default);
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
        const speeder1 = this.add.image(130, mainHeight - 170, "speeder1");
        speeder1.setVisible(false);
        const enemySpeeder1 = this.add.image(100, 100, "enemySpeeder1");
        enemySpeeder1.setVisible(false);
        const destroyer1 = this.add.image(130, mainHeight - 170, "destroyer1");
        destroyer1.setVisible(false);
        const enemyDestroyer1 = this.add.image(100, 100, "enemyDestroyer1");
        enemyDestroyer1.setVisible(false);
        this.selectedUnitPicture = enemyDestroyer1;
        this.unitPictureMap = {
            fighter1: fighterUnit1,
            enemyFighter1: enemyFighter1,
            speeder1: speeder1,
            enemySpeeder1: enemySpeeder1,
            destroyer1: destroyer1,
            enemyDestroyer1: enemyDestroyer1,
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
            this.board.setInteractive().on("tiledown", (pointer, tileXY) => {
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
        statSheet += "Health: " + maxHealth + "/" + health + "\n";
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
    formatPicName(unitName) {
        let firstLetter = unitName.charAt(0);
        firstLetter = firstLetter.toLowerCase();
        const nameLength = unitName.length;
        const fileName = firstLetter + unitName.substring(1, nameLength - 4) + "1";
        return fileName;
    }
}
exports.default = UI;
//# sourceMappingURL=ui.js.map