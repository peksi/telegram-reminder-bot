import { db } from "../index";

export default function getLastBio() {
  return db
    .get("tasks")
    .filter(["chore", "bio"])
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}
