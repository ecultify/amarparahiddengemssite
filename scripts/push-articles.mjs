/* Replace the CMS article list with src/data/articles.json — run on the box,
   where DATABASE_URL points at the live Postgres. Backs the old value up to
   scripts/.content-backup.json first. Idempotent: re-running is harmless. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
if (!process.env.DATABASE_URL) throw new Error("push-articles: no DATABASE_URL");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
const stored = rows[0]?.data ?? {};
writeFileSync("scripts/.content-backup.json", JSON.stringify(stored, null, 2));

const articles = JSON.parse(readFileSync("src/data/articles.json", "utf8"));
await client.query(
  `INSERT INTO documents (path, data, updated_at) VALUES ('content.json', $1, now())
   ON CONFLICT (path) DO UPDATE SET data = $1, updated_at = now()`,
  [JSON.stringify({ ...stored, articles })],
);

const { rows: after } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
const check = after[0].data;
console.log(`backed up ${stored.articles?.length ?? 0} -> wrote ${check.articles.length} articles`);
console.log("order:", check.articles.map((a) => a.title).join(" | "));
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
await client.end();
