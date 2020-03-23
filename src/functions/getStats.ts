import { authenticateUser, db } from "..";
import { ContextMessageUpdate } from "telegraf";
const _ = require("lodash");

import { Chore, getChorePoints } from "../chores";

const getStats = async (ctx: ContextMessageUpdate) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    console.log(db.get("tasks").value());
    const tasks = await db.get("tasks").value();

    const calculatePoints = (taskDoer: string) => {
      const doerTasks = _.filter(tasks, ["user", taskDoer]);
      console.log("doerTasks", doerTasks);

      const totalPoints = _.reduce(
        doerTasks,
        function(sum: number, n: any) {
          return sum + n.points;
        },
        0
      );

      console.log(`Total points of ${taskDoer}: ${totalPoints}`);
      return totalPoints;
    };

    const taskDoers = _.uniq(tasks.map((i: any) => i.user));
    console.log("taskDoers", taskDoers);

    const scoreBoard = taskDoers.map((i: any) => {
      return `${i} \t\t\t ${calculatePoints(i)}\n`;
    });

    console.log("scoreBoard", scoreBoard);
    return ctx.reply(`Täältäpä sataa vähän statseja!\n${scoreBoard.join("")}`);
  }
};

export default getStats;
