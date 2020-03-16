import { db } from "../index";

export default function getLastBio() {
  return db
    .get("bio")
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}
