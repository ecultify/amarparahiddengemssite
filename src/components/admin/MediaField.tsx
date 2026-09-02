"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/upload-media";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  value: string;
  kind: "image" | "video";
  onChange: (value: string) => void;
};

/** Upload-or-paste field. Files go straight to blob storage from the browser. */
export function MediaField({ id, value, kind, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const uploaded = await uploadMedia(file);
      onChange(uploaded.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error && uploadError.message
          ? uploadError.message
          : "Upload failed. JPG, PNG, WEBP or MP4 (videos up to 7 MB).",
      );
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
          {value ? (
            kind === "video" ? (
              <video src={value} className="size-full object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="size-full object-cover" />
            )
          ) : (
            <span className="text-[11px] text-muted-foreground">None</span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={kind === "video" ? "/videos/clip.mp4 or a blob URL" : "/images/photo.png or a blob URL"}
          />
          <div className="flex items-center gap-2">
            <Button asChild type="button" variant="outline" size="sm" disabled={busy}>
              <label className="cursor-pointer">
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                {busy ? "Uploading…" : "Upload file"}
                <input
                  type="file"
                  className="sr-only"
                  accept={kind === "video" ? "video/mp4,video/quicktime" : "image/jpeg,image/png,image/webp"}
                  onChange={handleFile}
                />
              </label>
            </Button>
            {value ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="size-3.5" /> Clear
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
