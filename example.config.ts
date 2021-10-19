const config = {
  telegraf_token: "<TOKEN_HERE>",
  users: [
    // telegram userID's that are permitted to use commands
    123,
    456,
    789
  ],
  broadcastChatId: -123456789, // chat where you want the reminders to be sent. use /info command to help you with this
  dbPath: "./db.json" // path where .json database is saved
};

export default config;
