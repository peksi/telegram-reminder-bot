const low = require("lowdb"); // Our json database
const FileSync = require("lowdb/adapters/FileSync");
const CronJob = require("cron").CronJob;

import Telegraf, { ContextMessageUpdate } from "telegraf"; // Module to use Telegraf API.
import addChore from "./functions/addChore";
import getStats from "./functions/getStats";

import config from "../config";
import help from "./functions/help";

// time handling
import moment = require("moment");
import { checkChores, chores, getLastChoreDoneTexts } from "./chores";
moment.locale("fi");

// init db
const adapter = new FileSync(
  process.env.DOCKER ? "/db/db.json" : config.dbPath
);
export const db = low(adapter);
db.defaults({ tasks: [] }).write();

console.log(db.getState());

// cron
new CronJob(
  "00 00 17 * * *",
  function () {
    checkChores();
  },
  null,
  true,
  "Europe/Helsinki"
);

// auth
export function authenticateUser(userId: number) {
  const users = config.users;
  console.log("users", users);
  console.log("userId", userId);
  if (users.includes(userId)) {
    console.log("user is included");
    return true;
  } else {
    console.log("user is not included");
    return false;
  }
}

export const bot = new Telegraf(config.telegraf_token); // Let's instantiate a bot using our token.

const BROADCAST_CHAT_ID = config.broadcastChatId;

// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log(
    "Server has initialized bot nickname. Nick: " + bot_informations.username
  );
});

// Simple command to ensure that we're live
bot.command("start", (ctx) => ctx.reply("Let's a go!"));

// Helpful command for parsing the chatID that is required for broadcasting messages
bot.command("info", (ctx) => {
  const from = ctx.update.message.from;

  ctx.reply(
    "Sinun userId on " +
      from.id +
      "\nTämän chatin id on " +
      ctx.chat.id.toString()
  );
});
bot.command("apua", (ctx) => help(ctx));
bot.command("commands", (ctx: ContextMessageUpdate) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    return ctx.reply(
      "Komennot BotFatheria varten:\n\n" +
        chores
          .sort((a, b) => (a.command > b.command ? 1 : -1))
          .map(
            (chore) =>
              `${chore.command} - ${chore.description} ${chore.points}p`
          )
          .join("\n") +
        "apua - apua\n" +
        "info - näytä chattitiedot\n" +
        "stats - tilastot\n"
    );
  }
});

chores.forEach((chore) => {
  bot.command(chore.command, (ctx) => addChore(ctx, chore));
});

bot.command("stats", (ctx) => getStats(ctx));

bot.command("boogie", (ctx) => {
  // get stats

  ctx.reply(getLastChoreDoneTexts().join("\n"));
});

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
