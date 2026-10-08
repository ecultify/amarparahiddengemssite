"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";
import { queueSheetSync } from "@/lib/sheet-sync";
import { sendMetaEvent } from "@/lib/meta-capi";
import { getGemPhone, requireAdmin } from "@/lib/auth";
import { deleteUser, touchUser } from "@/lib/users";
import { getContent, saveContent } from "@/lib/content";
import {
  createSubmission,
  deleteSubmission,
  getSubmission,
  listSubmissions,
  updateSubmission,
  type SubmissionStatus,
} from "@/lib/submissions";

/** `eventId` is the Meta event_id the client must echo in its dataLayer push;
 *  `userData` rides along for GTM's enhanced conversions (the form has been
 *  reset by the time the client pushes, so it can't read them itself). */
export type SubmitState = {
  ok: boolean;
  error?: string;
  eventId?: string;
  userData?: { phone_number: string; first_name: string };
};

/** Public: called by the visitor-facing form. */
export async function submitGem(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const value = (key: string) => String(formData.get(key) ?? "").trim();

  const para = value("para");
  const location = value("location");
  const title = value("title");
  const description = value("description");
  const category = value("category");

  if (!para || !location || !title || !description || !category) {
    return { ok: false, error: "Please fill in your para, location, category, gem name and description." };
  }
  if (title.length > 100) {
    return { ok: false, error: "Keep the gem name under 100 characters." };
  }
  if (description.length > 250) {
    return { ok: false, error: "Keep the description under 250 characters." };
  }

  const name = value("name");
  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }

  // The verified number comes from the signed session cookie, never from the
  // form: a direct POST without a session is refused here.
  const phone = await getGemPhone();
  if (!phone) {
    return { ok: false, error: "Verify your mobile number before submitting." };
  }

  const upload = value("upload");
  const submission = await createSubmission({
    para,
    location,
    title,
    category: value("category") || "Uncategorised",
    description,
    name,
    phone,
    upload: upload || undefined,
    uploadType: upload ? (value("uploadType") as "image" | "video") : undefined,
    uploadName: value("uploadName") || undefined,
  });

  // The name goes on the user record too, so the Users desk can show it.
  await touchUser(phone, name);

  const eventId = crypto.randomUUID();
  const firstName = name.split(/\s+/)[0];
  await sendMetaEvent({
    headers: await headers(),
    eventName: "Lead",
    eventId,
    eventSourceUrl: "https://amarpara.in/submit",
    phone,
    firstName,
    externalId: submission.id,
    customData: { content_category: submission.category, content_name: para, source: "submit", has_upload: Boolean(upload) },
  });

  // The team's Google Sheet picks the entry up within seconds, after the
  // visitor already has their response.
  after(queueSheetSync);

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/users");
  return { ok: true, eventId, userData: { phone_number: `+91${phone.replace(/\D/g, "").slice(-10)}`, first_name: firstName } };
}

export async function setSubmissionStatus(id: string, status: SubmissionStatus) {
  await requireAdmin();
  const current = await getSubmission(id);
  if (!current) return;
  await updateSubmission(id, { status });

  // Crossing the "counted" line moves the public 500 counter with it, so
  // pushing a gem in (or pulling one out) needs no trip to Settings.
  const delta = (status === "counted" ? 1 : 0) - (current.status === "counted" ? 1 : 0);
  if (delta !== 0) {
    const content = await getContent();
    await saveContent({
      ...content,
      gemCount: {
        ...content.gemCount,
        discovered: Math.max(0, content.gemCount.discovered + delta),
      },
    });
    for (const path of ["/", "/500-gems", "/participate", "/submit"]) revalidatePath(path);
  }

  after(queueSheetSync);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
}

export async function removeSubmission(id: string) {
  await requireAdmin();
  await deleteSubmission(id);
  after(queueSheetSync);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/users");
}

/** Admin: the inbox's multi-select delete. */
export async function removeSubmissions(ids: string[]) {
  await requireAdmin();
  await Promise.all(ids.map(deleteSubmission));
  after(queueSheetSync);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/users");
}

/** Admin: a person and every gem they submitted go together — a submission
 *  credited to a deleted number would otherwise linger as an orphan. */
export async function removeUser(phone: string) {
  await requireAdmin();
  const digits = phone.replace(/\D/g, "");
  const theirs = (await listSubmissions()).filter((s) => (s.phone ?? "").replace(/\D/g, "") === digits);
  await Promise.all([deleteUser(digits), ...theirs.map((s) => deleteSubmission(s.id))]);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/users");
}
