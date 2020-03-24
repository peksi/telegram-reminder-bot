import { authenticateUser, db } from "..";
import { ContextMessageUpdate } from "telegraf";
const _ = require("lodash");

import getLastBio from "./getLastBio";
import getLastKukat from "./getLastKukat";
import moment = require("moment");

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
      ? "Bion tyhensi " +
        moment(lastBio.timestamp).fromNow() +
        " " +
        lastBio.user
      : "Kukaan ei ole vielä vienyt bioa";

    // ctx.reply(kukatStr + bioStr);

    return ctx.reply(
      `Täältäpä sataa vähän statseja!\n${scoreBoard.join("")}\n\n${kukatStr +
        bioStr}`
    );
  }
};

export default getStats;
