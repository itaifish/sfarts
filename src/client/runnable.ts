import TbsfartsGame from "./game/tbsfartsGame";
import Client from "./client";

const startClient = () => {
    const client: Client = new Client();
    client.listen();
    const game = new TbsfartsGame(client);
    // client.sendLoginAttempt("Fisherswamp", "1234");
    // client.sendLoginAttempt("Redstreak4", "4567");
};

startClient();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
