"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const FrontendAppComponent_1 = __importDefault(require("./FrontendAppComponent"));
require("./index.css");
require("./login/myStyle.css");
const title = "React with Webpack and Babel";
react_dom_1.default.render(react_1.default.createElement(FrontendAppComponent_1.default, null), document.getElementById("app"));
//# sourceMappingURL=index.js.map