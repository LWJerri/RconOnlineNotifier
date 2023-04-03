import "dotenv/config";
import cron from "node-cron";
import hash from "object-hash";
import { Rcon } from "rcon-client";

const { RCON_HOST, RCON_PASSWORD, RCON_PORT, BOT_TOKEN, CHAT_ID } = process.env;

async function onlineCheck() {
  const rconClient = await Rcon.connect({ host: RCON_HOST, password: RCON_PASSWORD, port: Number(RCON_PORT) });

  let actualPlayersListHash: string;

  const onlineList = await rconClient.send("list");
  const [title, players] = onlineList.split(": ");
  const playersList = players.split(", ");
  const playersListHash = hash(playersList);

  if (!actualPlayersListHash) {
    actualPlayersListHash = playersListHash;
  }

  if (actualPlayersListHash !== playersListHash && playersList[0] !== "" && playersList[0] !== "LWJerri") {
    actualPlayersListHash = playersListHash;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `${title}:\n\n- ${playersList.join(", ")}`,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }
}

cron.schedule("*/30 * * * *", async () => await onlineCheck(), { runOnInit: true, timezone: "Europe/Kyiv" });
