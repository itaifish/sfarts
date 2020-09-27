import AWS from "aws-sdk";

// TODO: Set up email confirmation for accounts
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javascript/example_code/ses/ses_sendtemplatedemail.js
export default class EmailManager {
    constructor() {
        AWS.config.update({ region: "REGION" });
    }
}
