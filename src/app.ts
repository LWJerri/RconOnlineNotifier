import "dotenv/config";
import cron from "node-cron";
import { Rcon } from "rcon-client";

const { RCON_HOST, RCON_PASSWORD, RCON_PORT, BOT_TOKEN, CHAT_ID } = process.env;

let actualPlayersList: string[] = [];

async function sendMessage(title: string, players: string[]) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `${title}:\n\n- ${players.join(", ")}`,
      }),
    });
  } catch (err) {
    console.error("Error sending Telegram message:", err);
  }
}

async function checkServerOnline() {
  try {
    const rconClient = await Rcon.connect({ host: RCON_HOST, password: RCON_PASSWORD, port: parseInt(RCON_PORT) });

    const currentOnline = await rconClient.send("list");
    const [title, unparsedPlayers] = currentOnline.split(": ");
    const parsedPlayers = unparsedPlayers.split(", ").sort();

    if (JSON.stringify(actualPlayersList) !== JSON.stringify(parsedPlayers) && parsedPlayers[0] !== "") {
      actualPlayersList = parsedPlayers;
      await sendMessage(title, parsedPlayers);
    }
  } catch (err) {
    console.error("Error checking current online players:", err);
  }
}

cron.schedule("*/30 * * * *", checkServerOnline, { runOnInit: true, timezone: "Europe/Kyiv" });
