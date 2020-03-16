import { db } from "../bot";

export default function getLastBio() {
  return db
    .get("bio")
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}
