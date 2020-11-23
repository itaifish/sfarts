"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// TODO: Set up email confirmation for accounts
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javascript/example_code/ses/ses_sendtemplatedemail.js
class EmailManager {
    constructor() {
        aws_sdk_1.default.config.update({ region: "REGION" });
    }
}
exports.default = EmailManager;
//# sourceMappingURL=emailManager.js.map