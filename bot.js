const Telegraf = require("telegraf"); // Module to use Telegraf API.
const { Extra, Markup } = Telegraf; // Extract Extra, Markups from Telegraf module.
const config = require("./config"); // Configuration file that holds telegraf_token API key.
const low = require("lowdb"); // Our json database
const FileSync = require("lowdb/adapters/FileSync");
const CronJob = require("cron").CronJob;

// reminder settings

const MAX_BIO_DAYS = 5;
const MAX_KUKKA_DAYS = 7;

// time handling
const moment = require("moment");
moment.locale("fi");

// init db
const adapter = new FileSync(config.dbPath);
const db = low(adapter);
db.defaults({ bio: [], kukat: [] }).write();

console.log(db.getState());

// db functions
function addBio(timestamp, user) {
  db.get("bio")
    .push({ timestamp, user })
    .write();
}

function addKukat(timestamp, user) {
  db.get("kukat")
    .push({ timestamp, user })
    .write();
}

function getLastBio() {
  return db
    .get("bio")
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}

function getLastKukat() {
  return db
    .get("kukat")
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
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
function authenticateUser(userId) {
  const users = config.users;

  if (users.includes(parseInt(userId))) {
    return true;
  } else {
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
  ctx.reply(ctx.chat.id);
});


bot.command("bio", ctx => {
  // check auth
  const from = ctx.update.message.from;
  if (!authenticateUser(from.id)) {
    console.log("Tunkeutuja!");
    ctx.reply("Hei, käyttäjä " + from.id + ". Sinä et taida kuulua tänne.");
    return;
  }

  addBio(Date.now(), from.first_name);

  ctx.reply(
    "Hyvä homma " +
      from.first_name +
      "! Muistuttelen uudestaan viiden päivän kuluttua"
  );
});
bot.command("kukat", ctx => {
  // check auth
  const from = ctx.update.message.from;
  if (!authenticateUser(from.id)) {
    console.log("Tunkeutuja!");
    ctx.reply("Hei, käyttäjä " + from.id + ". Sinä et taida kuulua tänne.");
    return;
  }

  addKukat(Date.now(), from.first_name);

  ctx.reply("Kiitos " + from.first_name + "! Viikon päästä uudestaan?");
});
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
