/* One-off: replace the CMS "Explore the Gems" list with the TOI doc entries. */
import { readFileSync } from "node:fs";
import { Redis } from "@upstash/redis";
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] ??= m[2];
}
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const stored = await redis.get("content.json");
const gems = JSON.parse(readFileSync("src/data/gems.json", "utf8"));
await redis.set("content.json", { ...stored, gems });
const check = await redis.get("content.json");
console.log(`gems ${stored.gems.length} -> ${check.gems.length}`);
console.log("first:", check.gems[0].title, "|", check.gems[0].image);
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
