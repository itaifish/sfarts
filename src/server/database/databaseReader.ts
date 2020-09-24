import { User, UserStatus } from "../manager/userManager";

export default class DatabaseReader {
    loadUsers(): User[] {
        return [
            {
                username: "Fisherswamp",
                password: "1234",
                status: UserStatus.OFFLINE,
                id: 0,
            },
            {
                username: "Redstreak4",
                password: "1234",
                status: UserStatus.OFFLINE,
                id: 1,
            },
        ];
    }
}
