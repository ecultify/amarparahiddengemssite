import { GemCountForm } from "@/components/admin/GemCountForm";
import { getContent } from "@/lib/content";

export default async function SettingsPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">The campaign counter shown across the site.</p>
      </header>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Campaign counter</h2>
          <p className="text-sm text-muted-foreground">
            Drives the hero count, the gallery progress bar and the &ldquo;Gems Already
            Discovered&rdquo; card. Pushing a submission into the 500 moves it up by one on its
            own, so this is only for manual corrections.
          </p>
        </div>
        <GemCountForm discovered={content.gemCount.discovered} total={content.gemCount.total} />
      </section>
    </div>
  );
}
