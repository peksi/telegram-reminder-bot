import { bot, db } from ".";
import config from "../config";

export type Chore = {
  name: string;
  command: string;
  description: string;
  points: number;
  reminderAfterDays?: number;
  reminderText?: string;
};

export const chores: Chore[] = [
  {
    name: "Astianpesukone",
    command: "apk",
    description: "puhtaiden tyhjäys & leijuvat likaiset sisään",
    points: 5,
  },
  {
    name: "Bio",
    command: "bio",
    description: "roskis-run sisältäen bion",
    points: 5,
    reminderAfterDays: 5,
    reminderText: "Hei nyt! Bio on haissu kohta {} päivää. Oisko aika viedä?",
  },
  {
    name: "Roskat",
    command: "roskat",
    description: "roskis-run ilman bioo",
    points: 5,
  },
  {
    name: "Pullot",
    command: "pullot",
    description: "kauppaan",
    points: 5,
  },
  {
    name: "Neato",
    command: "neato",
    description: "laita Neato siivoo sun puolesta",
    points: 5,
    reminderAfterDays: 5,
    reminderText: "Pölyjä kertyny lattialle {} päivää. Laita Neato pyörii!",
  },
  {
    name: "Pyykit",
    command: "pyykit",
    description: "yks koneellinen",
    points: 5,
  },
  {
    name: "Imuroi",
    command: "imuroi",
    description: "nurkista jne vaikeista paikoista",
    points: 10,
    reminderAfterDays: 14,
    reminderText:
      "Pölyjä kertyny nurkkiin {} päivää. Imurointi ois paikallaan.",
  },
  {
    name: "Pölyjen pyyhkiminen",
    command: "polyt",
    description: "pölyjen pyyhkiminen rätillä",
    points: 10,
    reminderAfterDays: 14,
    reminderText:
      "Pölyt tasolla ois hyvä pyyhkii välillä. Jo {} päivää pyyhkimättä!",
  },
  {
    name: "Kukkien kastelu",
    command: "kukat",
    description: "kukkien kastelu",
    points: 5,
    reminderAfterDays: 7,
    reminderText: "Kukat tarviis joskus vettä! Menny {} päivää ilman.",
  },
  {
    name: "Pyykkien laitto kaappiin",
    command: "kaapitus",
    description: "pyykkien laitto kaappiin",
    points: 5,
  },
  {
    name: "Suihkun siivous",
    command: "suihku",
    description: "suihkun siivous",
    points: 30,
    reminderAfterDays: 30,
    reminderText:
      "Suihku putsattu viimeks {} päivää sitten. Harja heilumaan?",
  },
  {
    name: "Pytty",
    command: "pytty",
    description: "pytyn harjaus ja pölyjen pyyhkiminen",
    points: 5,
    reminderAfterDays: 7,
    reminderText:
      "Pytty putsattu viimeks {} päivää sitten. Harja heilumaan?",
  },
  {
    name: "WC Lavuaari",
    command: "wc",
    description: "wc lavuaarin siivous (pölypuhdistus ylä- ja alatasot)",
    points: 5,
    reminderAfterDays: 7,
    reminderText:
      "WC:n lavuaari ja ylä- ja alatasot putsattu {} päivää sitten. Pitäskö putsaa nopee?",
  },
  {
    name: "Lakanat",
    command: "lakanat",
    description: "lakanoiden vaihto - sängystä kaikki",
    points: 5,
    reminderAfterDays: 21,
    reminderText:
      "Lakanat vaihdettu {} päivää sitten. Pitäskö vaihtaa nopee?",
  },
  {
    name: "Keittiö",
    command: "keittio",
    description: "hellan ja lavuaarin putsaaminen",
    points: 5,
    reminderAfterDays: 7,
    reminderText:
      "Keittiön hella ja lavuaari putsattu {} päivää sitten. Pitäskö putsaa nopee?",
  },
];

const getLastChore = (chore: Chore) => {
  return db
    .get("tasks")
    .filter(["chore.command", chore.command])
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
};

export const checkChores = () => {
  console.log("checkChores");
  chores
    .filter((chore) => chore.reminderAfterDays)
    .forEach((chore) => {
      try {
        const lastChore = getLastChore(chore);
        if (lastChore) {
          const daysSinceChore =
            (Date.now() - lastChore.timestamp) / 1000 / 60 / 60 / 24;
          console.log(`Days since chore ${chore.name}, reminder in ${chore.reminderAfterDays - daysSinceChore}`, daysSinceChore);
          if (daysSinceChore > chore.reminderAfterDays) {
            bot.telegram.sendMessage(
              config.broadcastChatId,
              chore.reminderText.replace("{}", String(Math.round(daysSinceChore)))
            );
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    });
};

export const getLastChoreDoneTexts = () => {
  return chores
    .filter((chore) => chore.reminderAfterDays)
    .map((chore) => {
      const lastChore = getLastChore(chore);
      console.log(lastChore);
      if (!lastChore) return `${chore.name} ei oo tehty viimeks!`;
      const daysSinceChore =
        (Date.now() - lastChore.timestamp) / 1000 / 60 / 60 / 24;
      return `${chore.name} tehny viimeks ${lastChore.user} ${Math.round(
        daysSinceChore
      )} päivää sitten.`;
    });
};
