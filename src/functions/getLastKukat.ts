import { db } from "../index";

export default function getLastKukat() {
  return db
    .get("kukat")
    .sortBy("timestamp")
    .reverse()
    .take(1)
    .value()[0];
}
