const low = require("lowdb"); // Our json database
const FileSync = require("lowdb/adapters/FileSync");
const CronJob = require("cron").CronJob;

import Telegraf from "telegraf"; // Module to use Telegraf API.
import getLastBio from "./functions/getLastBio";
import getLastKukat from "./functions/getLastKukat";
import addChore from "./functions/addChore";
import getStats from "./functions/getStats";

import config from "../config";
import help from "./functions/help";

// reminder settings

const MAX_BIO_DAYS = 4;
const MAX_KUKKA_DAYS = 6;

// time handling
import moment = require("moment");
import { chores } from "./chores";
moment.locale("fi");

// init db
const adapter = new FileSync(config.dbPath);
export const db = low(adapter);
db.defaults({ tasks: [] }).write();

console.log(db.getState());

// cron
new CronJob(
  "00 00 17 * * *",
  function() {
    checkBio();
    checkKukat();
  },
  null,
  true,
  "Europe/Helsinki"
);

checkBio();
checkKukat();

function checkBio() {
  console.log("lastbio");
  try {
    const daysSinceBio =
      (Date.now() - getLastBio().timestamp) / 1000 / 60 / 60 / 24;
    console.log("daysSinceBio", daysSinceBio);
    if (daysSinceBio > MAX_BIO_DAYS) {
      bot.telegram.sendMessage(
        BROADCAST_CHAT_ID,
        "Hei nyt jätkät! Bio on haissut jo " +
          Math.round(daysSinceBio) +
          " päivää. Olisko aika vaikka tyhjätä?"
      );
    }
  } catch (error) {
    console.log("error", error);
  }
}

function checkKukat() {
  console.log("lastkukat");
  try {
    const daysSinceKukat =
      (Date.now() - getLastKukat().timestamp) / 1000 / 60 / 60 / 24;
    console.log("daysSinceKukat", daysSinceKukat);
    if (daysSinceKukat > MAX_KUKKA_DAYS) {
      bot.telegram.sendMessage(
        BROADCAST_CHAT_ID,
        "Onks meillä enää viherkasveja hengissä? Vettä!"
      );
    }
  } catch (error) {
    console.log("error", error);
  }
}

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

const bot = new Telegraf(config.telegraf_token); // Let's instantiate a bot using our token.

const BROADCAST_CHAT_ID = config.broadcastChatId;

// We can get bot nickname from bot informations. This is particularly useful for groups.
bot.telegram.getMe().then(bot_informations => {
  bot.options.username = bot_informations.username;
  console.log(
    "Server has initialized bot nickname. Nick: " + bot_informations.username
  );
});

// Simple command to ensure that we're live
bot.command("start", ctx => ctx.reply("Let's a go!"));

// Helpful command for parsing the chatID that is required for broadcasting messages
bot.command("info", ctx => {
  const from = ctx.update.message.from;

  ctx.reply(
    "Sinun userId on " +
      from.id +
      "\nTämän chatin id on " +
      ctx.chat.id.toString()
  );
});
bot.command('apua', ctx => help(ctx));

chores.forEach(chore => {
  bot.command(chore.command, ctx => addChore(ctx, chore));
});

bot.command("stats", ctx => getStats(ctx));

bot.command("boogie", ctx => {
  // get stats
  const lastBio = getLastBio();
  const lastKukat = getLastKukat();

  console.log("lastBio", lastBio);
  console.log("lastKukat", lastKukat);

  const kukatStr = lastKukat
    ? lastKukat.user +
      " kasteli kukat " +
      moment(lastKukat.timestamp).fromNow() +
      ".\n"
    : "Kukaan ei ole vielä kastellut kukkia\n";

  const bioStr = lastBio
    ? "Bion tyhensi " + moment(lastBio.timestamp).fromNow() + " " + lastBio.user
    : "Kukaan ei ole vielä vienyt bioa";

  ctx.reply(kukatStr + bioStr);
});

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
