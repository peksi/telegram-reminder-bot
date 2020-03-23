export enum Chore {
  Apk = "apk",
  Bio = "bio",
  Roskat = "roskat",
  Pullot = "pullot",
  Astiakaappi = "astiakaappi",
  Kukat = "kukat",
  Pyyhkeet = "pyyhkeet"
}

export const getChorePoints = (chore: Chore) => {
  switch (chore) {
    case Chore.Apk:
      return 5;
    case Chore.Bio:
      return 5;
    case Chore.Roskat:
      return 5;
    case Chore.Pullot:
      return 5;
    case Chore.Astiakaappi:
      return 3;
    case Chore.Kukat:
      return 3;
    case Chore.Pyyhkeet:
      return 5;
    default:
      console.log("error. no chore like this");
      return 0;
  }
};
