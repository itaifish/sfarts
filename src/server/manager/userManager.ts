import DatabaseReader from "../database/databaseReader";
import socketio from "socket.io";

export interface User {
    username: string;
    password: string;
    status: UserStatus;
    id: number;
    socket?: socketio.EngineSocket;
}

export enum UserStatus {
    OFFLINE,
    ONLINE,
    IN_LOBBY,
    IN_GAME,
}

interface UserTokenMap {
    [key: string]: User;
}

interface UserIdMap {
    [key: string]: User;
}

export default class UserManager {
    userTokenMap: UserTokenMap;

    userIdMap: UserIdMap;

    usernamesMap: UserIdMap;

    runningId: number;

    constructor() {
        this.userIdMap = {};
        this.userTokenMap = {};
        this.usernamesMap = {};
        this.loadUsers();
    }

    /**
     * This function loads the users from the database
     */
    loadUsers(): void {
        const reader: DatabaseReader = new DatabaseReader();
        reader.loadUsers().forEach((user) => {
            this.userIdMap[user.id] = user;
            this.usernamesMap[user.username] = user;
        });
    }

    /**
     * This function creates a user and returns true if successful, false if user is not unique
     * @param user The user to create
     */
    createUser(username: string, password: string): boolean {
        if (this.usernamesMap[username]) {
            return false;
        }
        this.runningId += 1;
        const user: User = {
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
     * This function logs a user in, returning true if successful, null if the user does not
     * exist, and false if the password is incorrect
     * @param username User's username
     * @param password User's password
     */
    loginUser(username: string, password: string, socket: socketio.EngineSocket): boolean | null {
        const user: User = this.usernamesMap[username];
        if (user) {
            if (user.password === password) {
                if (user.status != UserStatus.OFFLINE) {
                    this.logoutUser(username);
                }
                user.socket = socket;
                user.status = UserStatus.ONLINE;
                this.userTokenMap[socket.id] = user;
                return true;
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
    logoutUser(username: string): boolean {
        const user = this.usernamesMap[username];
        if (user) {
            delete this.userTokenMap[user.socket.id];
            user.status = UserStatus.OFFLINE;
            user.socket = null;
            return true;
        }
        return false;
    }

    /**
     * If a user disconnects without triggering logout functionality,
     * this function will try to look up the user by user token and then
     * log them out
     * @param token socket id to log user out
     */
    userDisconnected(token: string): boolean {
        const user = this.userTokenMap[token];
        if (user) {
            return this.logoutUser(user.username);
        } else {
            return false;
        }
    }
}
