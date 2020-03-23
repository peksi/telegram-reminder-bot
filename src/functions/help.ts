import { authenticateUser } from "..";
import { ContextMessageUpdate } from "telegraf";

const help = (ctx: ContextMessageUpdate) => {
  const from = ctx.update.message.from;
  if (authenticateUser(from.id)) {
    return ctx.reply(
      "Hei sinä. Olen kyklooppi ja tehtävänäni on varmistaa Wapovallan siisteys ja puhtaus. Olet päässyt jo pitkälle. Olet jo täällä. Apollo rakastaa sinua. Nyt sinun aikasi on rakastaa Apolloa takaisin. \n\nSeuraava taulukko näyttää sinulle rakkaudentunnustuksestasi oikeuttavat pisteet. \n\n" +
        "/apk puhtaiden tyhjäys & leijuvat likaiset sisään 5p \n" +
        "/bio roskis-run sisältäen bion 5p \n" +
        "/roskat roskis-run ilman bioo 5p \n" +
        "/pullot kauppaan 5p \n" +
        "/astiakaappi tyhjennys 3p \n" +
        "/kukat kukkien kastelu 3p \n" +
        "/pyyhkeet käsipyyhkeiden pesu 5p \n" +
        "/rakasta <henkilö>  kerää jonkun muun jälkiä 2p \n" +
        "/nosto <henkilö> 1p. huomionarvoinen ei-rekisteröity rakkaudenosoitus jonka voi antaa toiselle \n" +
        "/statsit scoreboard \n"
    );
  }
};

export default help;
