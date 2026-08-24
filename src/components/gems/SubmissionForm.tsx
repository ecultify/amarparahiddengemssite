"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import { UploadCloud } from "@/components/ui/icons";
import { SUBMISSION_CATEGORIES } from "@/lib/tokens";
import { submitGem, type SubmitState } from "@/app/actions/submissions";

const STEPS = ["Your Para", "Your Gem", "Photo / Video"];

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const FIELD =
  "h-[52px] w-full rounded-[8px] border border-line bg-white px-4 font-body text-[15px] text-navy placeholder:text-slate focus:border-pink focus:outline-none";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="w-full text-left font-display text-[16px] font-bold text-navy">{children}</span>;
}

type Upload = { url: string; name: string; type: "image" | "video" };

/** form-card — Figma 95:341. Three steps; uploads go straight to blob storage. */
export function SubmissionForm() {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<Upload | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(submitGem, { ok: false });

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    if (!picked) return;
    setUploadError(null);
    if (picked.size > MAX_UPLOAD_BYTES) {
      setUploadError("That file is over the 10 MB limit.");
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(picked.name, picked, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setFile({
        url: blob.url,
        name: picked.name,
        type: picked.type.startsWith("video") ? "video" : "image",
      });
    } catch {
      setUploadError("That file couldn't be uploaded. JPG, PNG or MP4 up to 10 MB.");
    } finally {
      setUploading(false);
      // Let the same file be re-picked after a remove.
      event.target.value = "";
    }
  }

  if (state.ok) {
    return (
      <div className="flex w-full max-w-[640px] flex-col items-center gap-4 rounded-[20px] bg-white p-10 text-center shadow-[0_12px_16px_rgba(27,42,74,0.06)]">
        <h2 className="font-title text-[38px] font-black text-navy">Thank you — your gem is in.</h2>
        <p className="max-w-[420px] font-body text-[16px] leading-[1.5] text-slate">
          Our editors review every entry before it joins the 500. We&apos;ll be in touch if we need
          anything else.
        </p>
        <a
          href="/500-gems"
          className="btn-3d mt-2 inline-flex h-14 items-center justify-center rounded-[4px] bg-yellow px-8 font-display text-[16px] font-extrabold uppercase text-navy"
        >
          Explore the gallery
        </a>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex w-full max-w-[640px] flex-col items-center gap-6 rounded-[20px] bg-white p-6 shadow-[0_12px_16px_rgba(27,42,74,0.06)] sm:gap-8 sm:p-10 lg:p-12"
    >
      {/* Step meter: segments fill as you advance — no dangling connector line. */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="font-ui text-[12px] font-extrabold uppercase tracking-[0.08em] text-pink">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="font-display text-[15px] font-extrabold text-navy">{STEPS[step]}</span>
        </div>
        <div className="flex gap-2">
          {STEPS.map((name, index) => (
            <span
              key={name}
              className={`h-[6px] flex-1 rounded-full ${index <= step ? "bg-pink" : "bg-line"}`}
            />
          ))}
        </div>
      </div>

      {/* Every step stays mounted so all values still post with the form. */}
      <div className={step === 0 ? "contents" : "hidden"}>
        <label className="flex w-full max-w-[440px] flex-col items-center gap-2">
          <Label>Para Location</Label>
          <input name="location" className={FIELD} placeholder="Enter the area or locality" />
        </label>

        <label className="flex w-full max-w-[440px] flex-col items-center gap-2">
          <Label>Para Name</Label>
          <input name="para" className={FIELD} placeholder="e.g. Bagbazar, Shyambazar, Ballygunge" />
        </label>

        <div className="flex w-full justify-center pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-3d inline-flex h-14 w-full items-center justify-center rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-navy)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-navy)] sm:w-[300px]"
          >
            Next
          </button>
        </div>
      </div>

      <div className={step === 1 ? "contents" : "hidden"}>
        <label className="flex w-full max-w-[440px] flex-col items-center gap-2">
          <Label>Gem Category</Label>
          <select name="category" className={FIELD} defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {SUBMISSION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex w-full max-w-[440px] flex-col items-center gap-2">
          <Label>Hidden Gem&apos;s Name</Label>
          <input name="title" className={FIELD} placeholder="Enter the name of the place" />
        </label>

        <label className="flex w-full max-w-[440px] flex-col items-center gap-2">
          <Label>Describe Your Hidden Gem</Label>
          <textarea
            name="description"
            rows={5}
            className="h-[140px] w-full resize-none rounded-[8px] border border-line bg-white p-4 font-body text-[15px] leading-[1.5] text-navy placeholder:text-slate focus:border-pink focus:outline-none"
            placeholder="Tell us what makes this gem special, why it matters to your para, and what others in Kolkata should know about it."
          />
        </label>

        <div className="flex w-full flex-col-reverse items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="inline-flex h-14 items-center justify-center rounded-[4px] border-2 border-navy px-8 font-display text-[16px] font-extrabold uppercase text-navy"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="btn-3d inline-flex h-14 w-full items-center justify-center rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-navy)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-navy)] sm:w-[300px]"
          >
            Next
          </button>
        </div>
      </div>

      <div className={step === 2 ? "contents" : "hidden"}>

        <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
          <Label>Upload Photo / Video</Label>
          {file ? (
            /* Not a <label>: wrapping this in one would make the Remove button
               re-open the file picker on the way back up. */
            <div className="flex w-full items-center gap-3 rounded-[12px] border-2 border-dashed border-pink bg-cream/30 p-4">
              {file.type === "video" ? (
                <video
                  src={file.url}
                  muted
                  playsInline
                  className="size-16 shrink-0 rounded-[8px] object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={file.url}
                  alt={file.name}
                  className="size-16 shrink-0 rounded-[8px] object-cover"
                />
              )}
              <span className="min-w-0 flex-1 truncate text-left font-display text-[15px] font-bold text-navy">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setUploadError(null);
                }}
                className="shrink-0 rounded-[6px] border border-line px-3 py-2 font-display text-[13px] font-bold text-navy hover:border-pink hover:text-pink"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-pink bg-cream/30 p-6 text-center sm:p-8">
              <input
                type="file"
                accept="image/jpeg,image/png,video/mp4"
                className="sr-only"
                onChange={handleFile}
              />
              <span className="flex size-12 items-center justify-center rounded-full bg-pink/8 text-pink">
                <UploadCloud />
              </span>
              <span className="font-display text-[18px] font-extrabold text-navy">
                {uploading ? "Uploading…" : "Add a Photo or Video"}
              </span>
              <span className="w-full max-w-[400px] font-body text-[14px] text-slate">
                Help us see your hidden gem. Upload an original photo or video, if available.
              </span>
              <span className="font-ui text-[11px] font-bold uppercase text-slate/60">
                Supported formats: JPG, PNG, MP4 | Max file size: 10 MB
              </span>
            </label>
          )}
          {uploadError ? (
            <p className="w-full text-left font-body text-[13px] text-red">{uploadError}</p>
          ) : null}
        </div>

        <input type="hidden" name="upload" value={file?.url ?? ""} />
        <input type="hidden" name="uploadType" value={file?.type ?? ""} />
        <input type="hidden" name="uploadName" value={file?.name ?? ""} />

        {state.error ? (
          <p className="w-full max-w-[440px] text-left font-body text-[14px] text-red">{state.error}</p>
        ) : null}

        <div className="flex w-full flex-col-reverse items-stretch justify-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex h-14 items-center justify-center rounded-[4px] border-2 border-navy px-8 font-display text-[16px] font-extrabold uppercase text-navy"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={pending || uploading}
            className="btn-3d inline-flex h-14 w-full items-center justify-center rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-navy)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-navy)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[300px]"
          >
            {pending ? "Sending…" : "Submit your gem"}
          </button>
        </div>
      </div>
    </form>
  );
}
