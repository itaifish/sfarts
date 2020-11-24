import React from "react";
import ReactDom from "react-dom";
import FrontendAppComponent from "./FrontendAppComponent";
import "./index.css";
import "./login/myStyle.css";

const title = "React with Webpack and Babel";

ReactDom.render(<FrontendAppComponent />, document.getElementById("app"));
