"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia, MAX_VIDEO_BYTES } from "@/lib/upload-media";
import { UploadCloud } from "@/components/ui/icons";
import { PhoneVerify } from "@/components/gems/PhoneVerify";
import { ShipAnimation } from "@/components/gems/ShipAnimation";
import { SUBMISSION_CATEGORIES } from "@/lib/tokens";
import { submitGem, type SubmitState } from "@/app/actions/submissions";

const STEPS = ["Your Para", "Your Gem", "Photo & Verify"];

// Photos are compressed before upload; videos have a hard cap in storage.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const FIELD =
  "h-[52px] w-full rounded-[8px] border border-line bg-white px-4 font-body text-[16px] text-navy transition-colors duration-150 placeholder:text-slate focus:border-pink";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="w-full text-left font-display text-[16px] font-bold text-navy">{children}</span>;
}

type Upload = { url: string; name: string; type: "image" | "video" };

/** form-card — Figma 95:341. Three steps; the last one carries the upload,
 *  phone verification and submit together. */
export function SubmissionForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [file, setFile] = useState<Upload | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(submitGem, { ok: false });

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    if (!picked) return;
    setUploadError(null);
    if (picked.type.startsWith("video") && picked.size > MAX_VIDEO_BYTES) {
      setUploadError("Videos can be up to 7 MB. Trim it or upload a photo instead.");
      event.target.value = "";
      return;
    }
    if (picked.size > MAX_UPLOAD_BYTES) {
      setUploadError("That file is too large.");
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const uploaded = await uploadMedia(picked);
      setFile({ url: uploaded.url, name: picked.name, type: uploaded.type });
    } catch (error) {
      setUploadError(
        error instanceof Error && error.message
          ? error.message
          : "That file couldn't be uploaded. JPG, PNG or MP4.",
      );
    } finally {
      setUploading(false);
      // Let the same file be re-picked after a remove.
      event.target.value = "";
    }
  }

  // A successful action lands on the thank-you page rather than swapping the
  // card out in place, so the confirmation is a URL the visitor can sit on.
  useEffect(() => {
    if (state.ok) router.push("/thank-you");
  }, [state.ok, router]);

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
            className="btn-3d inline-flex h-14 w-full items-center justify-center rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy sm:w-[300px]"
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
            className="h-[140px] w-full resize-none rounded-[8px] border border-line bg-white p-4 font-body text-[16px] leading-[1.5] text-navy transition-colors duration-150 placeholder:text-slate focus:border-pink"
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
            className="btn-3d inline-flex h-14 w-full items-center justify-center rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy sm:w-[300px]"
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
                className="icon-btn shrink-0 rounded-[6px] border border-line px-3 py-2 font-display text-[13px] font-bold text-navy"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-pink bg-cream/30 p-6 text-center sm:p-8">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,.heic,.heif,.mov"
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
                JPG, PNG, HEIC, MP4 or MOV | Videos up to 7 MB
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

        {/* Verification lives with the upload rather than in a step of its
            own, so the last screen is: attach a file, verify, submit. */}
        <div className="flex w-full max-w-[440px] flex-col items-center gap-2 pt-2 text-center">
          <Label>Verify your number</Label>
          <p className="font-body text-[14px] leading-[1.5] text-slate">
            We verify every submission against a mobile number so each gem can be credited to the
            person who found it.
          </p>
        </div>

        <PhoneVerify verified={Boolean(verifiedPhone)} onVerified={setVerifiedPhone} />

        <input type="hidden" name="phone" value={verifiedPhone ?? ""} />

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
            disabled={pending || uploading || !verifiedPhone}
            title={verifiedPhone ? undefined : "Verify your number to submit"}
            className="btn-3d inline-flex h-14 w-full items-center justify-center gap-3 rounded-[4px] bg-yellow font-display text-[16px] font-extrabold uppercase text-navy sm:w-[300px]"
          >
            {pending ? (
              <>
                <ShipAnimation />
                <span>Shipping…</span>
              </>
            ) : (
              "Submit your gem"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
