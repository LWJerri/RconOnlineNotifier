import "dotenv/config";
import cron from "node-cron";
import { Rcon } from "rcon-client";

const { RCON_HOST: host, RCON_PASSWORD: password, RCON_PORT, BOT_TOKEN, CHAT_ID } = process.env;

let actualPlayersList: string[];

async function checkCurrentOnline() {
  const rconClient = await Rcon.connect({ host, password, port: parseInt(RCON_PORT) });

  const currentOnline = await rconClient.send("list");
  const [title, unparsedPlayers] = currentOnline.split(": ");
  const parsedPlayersArray = unparsedPlayers.split(", ").sort();

  if (!actualPlayersList) {
    actualPlayersList = parsedPlayersArray;
  }

  if (JSON.stringify(actualPlayersList) !== JSON.stringify(parsedPlayersArray) && parsedPlayersArray[0] !== "") {
    actualPlayersList = parsedPlayersArray;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `${title}:\n\n- ${parsedPlayersArray.join(", ")}`,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }
}

cron.schedule("*/30 * * * *", async () => await checkCurrentOnline(), { runOnInit: true, timezone: "Europe/Kyiv" });
