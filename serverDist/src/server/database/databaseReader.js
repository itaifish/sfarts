"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userManager_1 = require("../manager/userManager");
class DatabaseReader {
    loadUsers() {
        return [
            {
                username: "user1",
                password: "1234",
                status: userManager_1.UserStatus.OFFLINE,
                id: 0,
            },
            {
                username: "user2",
                password: "1234",
                status: userManager_1.UserStatus.OFFLINE,
                id: 1,
            },
        ];
    }
}
exports.default = DatabaseReader;
//# sourceMappingURL=databaseReader.js.map