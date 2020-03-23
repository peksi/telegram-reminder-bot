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

const MAX_BIO_DAYS = 5;
const MAX_KUKKA_DAYS = 7;

// time handling
import moment = require("moment");
import { Chore } from "./chores";
moment.locale("fi");

// init db
const adapter = new FileSync(config.dbPath);
export const db = low(adapter);
db.defaults({ tasks: [] }).write();

console.log(db.getState());

// db functions
function addBio(timestamp: number, user: string) {
  db.get("bio")
    .push({ timestamp, user })
    .write();
}

function addKukat(timestamp: number, user: string) {
  db.get("kukat")
    .push({ timestamp, user })
    .write();
}

// cron
new CronJob(
  "00 00 12 * * *",
  function() {
    checkBio();
    checkKukat();
  },
  null,
  true,
  "Europe/Helsinki"
);

function checkBio() {
  console.log("lastbio");
  const daysSinceBio =
    (Date.now() - getLastBio().timestamp) / 1000 / 60 / 60 / 24;
  if (daysSinceBio > MAX_BIO_DAYS) {
    bot.telegram.sendMessage(
      BROADCAST_CHAT_ID,
      "Hei nyt jätkät! Bio on haissut jo " +
        Math.round(daysSinceBio) +
        " päivää. Olisko aika vaikka tyhjätä?"
    );
  }
}

function checkKukat() {
  console.log("lastkukat");
  const daysSinceKukat =
    (Date.now() - getLastKukat().timestamp) / 1000 / 60 / 60 / 24;
  if (daysSinceKukat > MAX_KUKKA_DAYS) {
    bot.telegram.sendMessage(
      BROADCAST_CHAT_ID,
      "Onks meillä enää viherkasveja hengissä? Vettä!"
    );
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

bot.command("apuva", ctx => help(ctx));
bot.command("apk", ctx => addChore(ctx, Chore.Apk));
bot.command("bio", ctx => addChore(ctx, Chore.Bio));
bot.command("roskat", ctx => addChore(ctx, Chore.Roskat));
bot.command("pullot", ctx => addChore(ctx, Chore.Pullot));
bot.command("astiakaappi", ctx => addChore(ctx, Chore.Astiakaappi));
bot.command("kukat", ctx => addChore(ctx, Chore.Kukat));
bot.command("pyyhkeet", ctx => addChore(ctx, Chore.Pyyhkeet));

bot.command("stats", ctx => getStats(ctx));

bot.command("boogie", ctx => {
  // get stats
  const lastBio = getLastBio();
  const lastKukat = getLastKukat();

  ctx.reply(
    lastKukat.user +
      " kasteli kukat " +
      moment(lastKukat.timestamp).fromNow() +
      ".\n" +
      "Paskimen tyhensi " +
      moment(lastBio.timestamp).fromNow() +
      " " +
      lastBio.user +
      ". " +
      (lastKukat.user === lastBio.user ? "\nHyvä " + lastKukat.user + "!" : "")
  );
});

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
