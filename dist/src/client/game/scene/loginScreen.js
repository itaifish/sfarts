"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageKeys = void 0;
const phaser_1 = __importDefault(require("phaser"));
const button_svg_1 = __importDefault(require("../../resources/images/button.svg"));
const background_png_1 = __importDefault(require("../../resources/images/background.png"));
const inputButton_1 = __importDefault(require("../gui/inputButton"));
const messageEnum_1 = __importDefault(require("../../../shared/communication/messageEnum"));
const loginMessage_1 = require("../../../shared/communication/messageInterfaces/loginMessage");
const logger_1 = __importStar(require("../../../shared/utility/logger"));
const lobbyScene_1 = __importDefault(require("./lobbyScene"));
var ImageKeys;
(function (ImageKeys) {
    ImageKeys["BUTTON"] = "button";
    ImageKeys["BACKGROUND"] = "background";
})(ImageKeys = exports.ImageKeys || (exports.ImageKeys = {}));
class LoginScreen extends phaser_1.default.Scene {
    constructor(client) {
        const config = {
            active: true,
        };
        super(config);
        this.client = client;
    }
    preload() {
        this.load.svg(ImageKeys.BUTTON, button_svg_1.default);
        this.load.image(ImageKeys.BACKGROUND, background_png_1.default);
    }
    create() {
        this.add.image(800, 450, ImageKeys.BACKGROUND);
        this.usernameButton = new inputButton_1.default(this, 800, 540, "Username", "text");
        this.passwordButton = new inputButton_1.default(this, 800, 740, "Password", "password");
        const enterButton = this.input.keyboard.addKey(phaser_1.default.Input.Keyboard.KeyCodes.ENTER);
        enterButton.on("down", (event) => {
            this.client.addOnServerMessageCallback(messageEnum_1.default.LOGIN, () => {
                if (this.client.loginStatus == loginMessage_1.LoginMessageResponseType.SUCCESS) {
                    // Go to next scene
                    logger_1.default("Login Success", this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
                    this.scene.start(lobbyScene_1.default.getSceneName());
                }
                else {
                    logger_1.default("Login Failure", this.constructor.name, logger_1.LOG_LEVEL.DEBUG);
                    // Clear password text
                    this.passwordButton.editableText.handleTextSubmit(this.passwordButton.editableText, "");
                }
            });
            const username = this.usernameButton.editableText.value;
            const password = this.passwordButton.editableText.value;
            this.client.sendLoginAttempt(username, password);
        });
    }
    static getSceneName() {
        return "LoginScreen";
    }
}
exports.default = LoginScreen;
//# sourceMappingURL=loginScreen.js.map