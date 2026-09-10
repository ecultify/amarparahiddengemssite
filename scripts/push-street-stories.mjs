/* One-off: replace the CMS written-tales list with the Amar Para 2 deck. */
import { readFileSync } from "node:fs";
import { Redis } from "@upstash/redis";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] ??= m[2];
}
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const stored = await redis.get("content.json");
const streetStories = JSON.parse(readFileSync("src/data/street-stories.json", "utf8"));
await redis.set("content.json", { ...stored, streetStories });
const check = await redis.get("content.json");
console.log(`written tales ${stored.streetStories.length} -> ${check.streetStories.length}`);
console.log("first:", check.streetStories[0].title, "|", check.streetStories[0].meta);
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
