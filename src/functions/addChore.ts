import { authenticateUser, db } from "..";
import { ContextMessageUpdate } from "telegraf";
import { Chore } from "../chores";

const addChore = (ctx: ContextMessageUpdate, chore: Chore) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    const points = chore.points;

    console.log({
      timestamp: Date.now(),
      user: from.first_name,
      points,
      chore
    });

    db.get("tasks")
      .push({ timestamp: Date.now(), user: from.first_name, points, chore })
      .write();

    return ctx.reply(
      `Oih! Kiitos paljon ${from.first_name}. Tästä saat ${points} pistettä.`
    );
  }
};

export default addChore;
