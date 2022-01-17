# Reminder Telegram Bot in Node.JS, using Telegraf

![image](http://i.imgur.com/brZuWj5.png)

This bot is used for your household needs. It reminds you on the groupchat whenever some recurring chore is not done in specific time.

NB! The current version has Finnish localization only.

## How to create the bot

### Step 1: create a 'user bot' and connect it with Node.js

- Open Telegram application on your computer;
- Contact BotFather through Telegram here: https://telegram.me/BotFather. This bot will be used to create your bot;
- As image suggests, follow those steps:
  ![image](http://i.imgur.com/POZq2tq.png)
- BotFather will provide you an API key. This API key is used to make requests to Telegram API in order to listen messages from your bot user, make bot answer accordingly and much more. Save it for next step.

### Step 2: configure your Node.js application

- Create config.js in the repository root with this content. Replace API_TOKEN with the API key you got from BotFather. After that you can start your application and with /info command populate users and broadcast chat id to .config.ts as well.

This file will be automatically ignored from .gitignore to secure your API key in GitHub.

- Install dependencies:

```
npm install
```

This will install all dependencies in `package.json` so just `telegraf` in order to use Telegram API.

Done! Your bot is now configured.

## Run the bot

- Start your application:

```
npm start
```

If it prints:

```
[SERVER] Bot started.
```

...congratulations! Now bot will do what you want. Current commands (in Finnish):

```
/apk puhtaiden tyhjäys & leijuvat likaiset sisään 5p
/bio roskis-run sisältäen bion 5p
/roskat roskis-run ilman bioo 5p
/pullot kauppaan 5p
/astiakaappi tyhjennys 3p
/kukat kukkien kastelu 3p
/pyyhkeet käsipyyhkeiden pesu 5p
/statsit scoreboard
```

# Documentation

Check Telegraf API: https://github.com/telegraf/telegraf.

# Credits

[Original project](https://github.com/fabnicolas/telegram-telegraf-bot) by Fabio Crispino aka Finalgalaxy

## Contributors to this reminder bot

* [peksi](https://github.com/peksi/)
* [ultsi](https://github.com/ultsi/)
