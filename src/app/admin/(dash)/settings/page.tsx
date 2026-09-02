import { GemCountForm } from "@/components/admin/GemCountForm";
import { Separator } from "@/components/ui/separator";
import { getContent } from "@/lib/content";
import { listSubmissions } from "@/lib/submissions";

export default async function SettingsPage() {
  const [content, submissions] = await Promise.all([getContent(), listSubmissions()]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Campaign counters and how this desk is wired up.</p>
      </header>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Campaign counter</h2>
          <p className="text-sm text-muted-foreground">
            Drives the hero count, the gallery progress bar and the &ldquo;Gems Already
            Discovered&rdquo; card.
          </p>
        </div>
        <GemCountForm discovered={content.gemCount.discovered} total={content.gemCount.total} />
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">How this works</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-[180px_1fr]">
          <dt className="text-muted-foreground">Storage</dt>
          <dd>
            Content and submissions live as JSON in Vercel Blob; uploads go to the same store
            straight from the browser.
          </dd>
          <dt className="text-muted-foreground">Submissions held</dt>
          <dd className="tabular-nums">{submissions.length}</dd>
          <dt className="text-muted-foreground">Access</dt>
          <dd>
            One shared password, set as <code className="rounded bg-muted px-1 py-0.5">ADMIN_PASSWORD</code>{" "}
            in the Vercel project. Change it there and everyone signs in with the new one.
          </dd>
          <dt className="text-muted-foreground">Publishing</dt>
          <dd>Saving a section rewrites the live site right away. There is no draft state.</dd>
        </dl>
      </section>
    </div>
  );
}
