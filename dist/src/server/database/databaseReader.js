"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userManager_1 = require("../manager/userManager");
class DatabaseReader {
    loadUsers() {
        return [
            {
                username: "Fisherswamp",
                password: "1234",
                status: userManager_1.UserStatus.OFFLINE,
                id: 0,
            },
            {
                username: "Redstreak4",
                password: "1234",
                status: userManager_1.UserStatus.OFFLINE,
                id: 1,
            },
        ];
    }
}
exports.default = DatabaseReader;
//# sourceMappingURL=databaseReader.js.map