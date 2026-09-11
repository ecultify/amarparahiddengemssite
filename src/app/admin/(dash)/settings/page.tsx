import { AnalyticsSettingsForm } from "@/components/admin/AnalyticsSettingsForm";
import { GemCountForm } from "@/components/admin/GemCountForm";
import { getContent } from "@/lib/content";
import { gaServiceAccountEmail } from "@/lib/ga";

export default async function SettingsPage() {
  const content = await getContent();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Campaign counter and Google Analytics.</p>
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

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Google Analytics</h2>
          <p className="text-sm text-muted-foreground">
            A GTM container or GA4 measurement ID loads Google&apos;s tag on every public page (never in this
            desk). The property ID lets the Overview pull realtime users, devices, platforms, places, pages and
            sources back from Google.
          </p>
        </div>
        <AnalyticsSettingsForm initial={content.analytics ?? {}} serviceAccount={gaServiceAccountEmail()} />
      </section>
    </div>
  );
}
