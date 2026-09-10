/* One-off: replace the CMS story list with the three filmed paras. */
import { readFileSync } from "node:fs";
import { Redis } from "@upstash/redis";
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] ??= m[2];
}
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const stored = await redis.get("content.json");
const stories = JSON.parse(readFileSync("src/data/stories.json", "utf8"));
await redis.set("content.json", { ...stored, stories });
const check = await redis.get("content.json");
console.log(`stories ${stored.stories.length} -> ${check.stories.length}`);
check.stories.forEach((s) => console.log("  ", s.name, "|", s.para, "|", s.video ?? "no clip"));
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
