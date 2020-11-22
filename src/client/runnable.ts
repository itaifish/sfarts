import TbsfartsGame from "./game/tbsfartsGame";
import Client from "./client";

const startClient = () => {
    const client: Client = new Client();
    client.listen();
    new TbsfartsGame(client);
};

startClient();
