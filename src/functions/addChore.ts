import { authenticateUser } from "..";
import { ContextMessageUpdate } from "telegraf";
import { Chore } from "../types";

const addChore = (ctx: ContextMessageUpdate, chore: Chore) => {
  console.log("hereee");
  console.log(Chore);
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    return ctx.reply(`Oih! Kiitos paljon ${from.first_name}`);
  }
};

export default addChore;
