import { db } from "../index";

export default function getLastKukat() {
  return db
    .get("tasks")
    .filter(["chore", "kukat"])
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}
