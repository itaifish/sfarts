"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = void 0;
const databaseReader_1 = __importDefault(require("../database/databaseReader"));
var UserStatus;
(function (UserStatus) {
    UserStatus[UserStatus["OFFLINE"] = 0] = "OFFLINE";
    UserStatus[UserStatus["ONLINE"] = 1] = "ONLINE";
    UserStatus[UserStatus["IN_LOBBY"] = 2] = "IN_LOBBY";
    UserStatus[UserStatus["IN_GAME"] = 3] = "IN_GAME";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
class UserManager {
    constructor() {
        this.userIdMap = {};
        this.userTokenMap = {};
        this.usernamesMap = {};
        this.loadUsers();
    }
    /**
     * This function loads the users from the database
     */
    loadUsers() {
        const reader = new databaseReader_1.default();
        reader.loadUsers().forEach((user) => {
            this.userIdMap[user.id] = user;
            this.usernamesMap[user.username] = user;
        });
    }
    /**
     * This function creates a user and returns true if successful, false if user is not unique
     * @param user The user to create
     */
    createUser(username, password) {
        if (this.usernamesMap[username]) {
            return false;
        }
        this.runningId += 1;
        const user = {
            username: username,
            password: password,
            status: UserStatus.OFFLINE,
            id: this.runningId,
        };
        this.userIdMap[user.id] = user;
        this.usernamesMap[user.username] = user;
        return true;
    }
    /**
     * This function logs a user in, returning the user if successful, null if the user does not
     * exist, and false if the password is incorrect
     * @param username User's username
     * @param password User's password
     */
    loginUser(username, password, socket) {
        const user = this.usernamesMap[username];
        if (user) {
            if (user.password === password) {
                if (user.status != UserStatus.OFFLINE) {
                    this.logoutUser(username);
                }
                user.socket = socket;
                user.status = UserStatus.ONLINE;
                this.userTokenMap[socket.id] = user;
                return user;
            }
            return false;
        }
        return null;
    }
    /**
     * This function logs the user out, removing their userToken from the
     * map and setting their status to be offline
     * @param username Username of user to log out
     */
    logoutUser(username) {
        const user = this.usernamesMap[username];
        if (user) {
            delete this.userTokenMap[user.socket.id];
            user.status = UserStatus.OFFLINE;
            user.socket = null;
            return true;
        }
        return false;
    }
    getUserFromSocketId(socketId) {
        return this.userTokenMap[socketId];
    }
    getUserFromUserId(userId) {
        return this.userIdMap[userId];
    }
    /**
     * If a user disconnects without triggering logout functionality,
     * this function will try to look up the user by user token and then
     * log them out
     * @param token socket id to log user out
     */
    userDisconnected(token) {
        const user = this.getUserFromSocketId(token);
        if (user) {
            return this.logoutUser(user.username);
        }
        else {
            return false;
        }
    }
}
exports.default = UserManager;
//# sourceMappingURL=userManager.js.map