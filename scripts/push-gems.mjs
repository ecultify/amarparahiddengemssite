/* Replace the CMS gallery lists with src/data — the "Photo & Video Stories"
   gems, the Written Tales, and the discovered-gems teaser derived from both.
   Run on the box, where DATABASE_URL points at the live Postgres. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) process.env[m[1]] ??= m[2];
  }
}
if (!process.env.DATABASE_URL) throw new Error("push-gems: no DATABASE_URL");

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const gems = read("src/data/gems.json");
const streetStories = read("src/data/street-stories.json");

// Same derivation as DISCOVERED_GEMS in src/data/site.ts, off the same
// pick list, so the pushed teaser cannot drift from the shipped one.
const discoveredGems = read("src/data/discovered-picks.json").map((title) => {
  const entry = [...gems, ...streetStories].find((e) => e.title === title);
  if (!entry) throw new Error(`Discovered gem is not in the gallery: ${title}`);
  return { image: "", ...entry };
});

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const { rows } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
const stored = rows[0]?.data ?? {};
writeFileSync("scripts/.content-backup.json", JSON.stringify(stored, null, 2));

await client.query(
  `INSERT INTO documents (path, data, updated_at) VALUES ('content.json', $1, now())
   ON CONFLICT (path) DO UPDATE SET data = $1, updated_at = now()`,
  [JSON.stringify({ ...stored, gems, streetStories, discoveredGems })],
);

const { rows: after } = await client.query("SELECT data FROM documents WHERE path = 'content.json'");
const check = after[0].data;
console.log(`gems ${stored.gems?.length ?? 0} -> ${check.gems.length}`);
console.log(`streetStories ${stored.streetStories?.length ?? 0} -> ${check.streetStories.length}`);
console.log(`discoveredGems ${stored.discoveredGems?.length ?? 0} -> ${check.discoveredGems.length}`);
console.log("teaser:", check.discoveredGems.map((g) => g.title).join(" | "));
console.log("other keys untouched:", Object.keys(check).length === Object.keys(stored).length);
await client.end();
