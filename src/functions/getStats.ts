import { authenticateUser, db } from "..";
import { ContextMessageUpdate } from "telegraf";
import { Chore, getChorePoints } from "../chores";

const getStats = (ctx: ContextMessageUpdate) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    console.log(db.get("tasks"));

    return ctx.reply(`Täältäpä sataa vähän statseja!`);
  }
};

export default getStats;
