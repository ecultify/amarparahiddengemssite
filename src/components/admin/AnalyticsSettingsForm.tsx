"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAnalyticsSettings } from "@/app/actions/content";
import type { AnalyticsSettings } from "@/lib/content";

export function AnalyticsSettingsForm({ initial, serviceAccount }: { initial: AnalyticsSettings; serviceAccount: string | null }) {
  const [values, setValues] = useState({
    gtmId: initial.gtmId ?? "",
    gaId: initial.gaId ?? "",
    gaPropertyId: initial.gaPropertyId ?? "",
  });
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const result = await saveAnalyticsSettings(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Saved", { description: "The public site loads the tag on its next request." });
    });

  const field = (key: keyof typeof values, label: string, placeholder: string, help: string) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={values[key]}
        placeholder={placeholder}
        onChange={(event) => setValues({ ...values, [key]: event.target.value })}
        className="font-mono"
      />
      <p className="text-xs text-muted-foreground">{help}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {field("gtmId", "GTM container ID", "GTM-XXXXXXX", "Tag Manager → your container → the ID in the top bar. Takes precedence: put GA4 inside the container.")}
        {field("gaId", "GA4 measurement ID", "G-XXXXXXXXXX", "GA Admin → Data streams → your web stream. Only used when there is no GTM ID.")}
        {field("gaPropertyId", "GA4 property ID", "123456789", "GA Admin → Property details, top right. Lets the Overview read reports.")}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Reports need a service-account key on the server:{" "}
          {serviceAccount ? (
            <>
              found, <span className="font-mono">{serviceAccount}</span> — add this email as a Viewer on the GA property.
            </>
          ) : (
            <>
              not set. Put the key JSON in <span className="font-mono">GA_SERVICE_ACCOUNT_KEY</span> and redeploy.
            </>
          )}
        </p>
        <Button size="sm" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : null} Save
        </Button>
      </div>
    </div>
  );
}
