import { authenticateUser } from "..";
import { ContextMessageUpdate } from "telegraf";
import { chores } from "../chores";

const help = (ctx: ContextMessageUpdate) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    return ctx.reply(
      "Moi! Bob tässä. Autan sua siivoomaan että saadaan koti pidettyy siistinä yhdessä Neaton kanssa.\n\n" +
        chores.map(chore => `/${chore.command} ${chore.description} ${chore.points}p`).join('\n')
    );
  }
};

export default help;
