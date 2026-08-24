"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveGemCount } from "@/app/actions/content";

export function GemCountForm({ discovered, total }: { discovered: number; total: number }) {
  const [values, setValues] = useState({ discovered: String(discovered), total: String(total) });
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      const next = { discovered: Number(values.discovered), total: Number(values.total) };
      if (!Number.isFinite(next.discovered) || !Number.isFinite(next.total) || next.total <= 0) {
        toast.error("Both counters need to be numbers, and the goal must be above zero.");
        return;
      }
      await saveGemCount(next.discovered, next.total);
      toast.success("Counter updated", { description: "Hero, gallery and progress bars all follow it." });
    });

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="discovered">Gems discovered</Label>
          <Input
            id="discovered"
            inputMode="numeric"
            value={values.discovered}
            onChange={(event) => setValues({ ...values, discovered: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="total">Goal</Label>
          <Input
            id="total"
            inputMode="numeric"
            value={values.total}
            onChange={(event) => setValues({ ...values, total: event.target.value })}
          />
        </div>
      </div>
      <Button className="w-fit" onClick={save} disabled={pending}>
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
        {pending ? "Saving…" : "Save counter"}
      </Button>
    </div>
  );
}
