/* Sweep em and en dashes out of every string in the live CMS content, including
   copy that was edited in the admin and never existed in src/data. Run on the
   box. Idempotent — a second run reports 0 and writes nothing. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import pg from "pg";
import { dedashDeep, countDashes } from "./dedash.mjs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
if (!process.env.DATABASE_URL) throw new Error("dedash-db: no DATABASE_URL");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const { rows } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
if (!rows[0]) throw new Error("dedash-db: no content.json row");
const stored = rows[0].data;

writeFileSync("scripts/.content-backup.json", JSON.stringify(stored, null, 2));

// Count per collection first, so the run says what it actually touched.
for (const [key, value] of Object.entries(stored)) {
  const n = countDashes(JSON.stringify(value));
  if (n) console.log(`${String(n).padStart(4)}  ${key}`);
}

const cleaned = dedashDeep(stored);
const before = countDashes(JSON.stringify(stored));
if (!before) {
  console.log("nothing to do");
} else {
  await client.query(
    `UPDATE documents SET data = $1, updated_at = now() WHERE path = 'content.json'`,
    [JSON.stringify(cleaned)],
  );
}

const { rows: after } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
const left = countDashes(JSON.stringify(after[0].data));
console.log(`dashes ${before} -> ${left}`);
console.log("keys untouched:", Object.keys(after[0].data).length === Object.keys(stored).length);
if (left) throw new Error("dedash-db: dashes survived the sweep");
await client.end();
