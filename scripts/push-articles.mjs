/* One-off: replace the CMS article list with the scraped Amar Para archive.
   Backs the old value up to scripts/.content-backup.json first. */
import { readFileSync, writeFileSync } from "node:fs";
import { Redis } from "@upstash/redis";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] ??= m[2];
}
const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });

const stored = await redis.get("content.json");
writeFileSync("scripts/.content-backup.json", JSON.stringify(stored, null, 2));

const articles = JSON.parse(readFileSync("src/data/articles.json", "utf8"));
await redis.set("content.json", { ...stored, articles });

const check = await redis.get("content.json");
console.log("backed up", stored.articles.length, "-> wrote", check.articles.length, "articles");
console.log("first:", check.articles[0].title, "|", check.articles[0].image);
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
