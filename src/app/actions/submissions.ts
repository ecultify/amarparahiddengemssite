"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import {
  createSubmission,
  deleteSubmission,
  getSubmission,
  updateSubmission,
  type SubmissionStatus,
} from "@/lib/submissions";

export type SubmitState = { ok: boolean; error?: string };

/** Public: called by the visitor-facing form. */
export async function submitGem(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const value = (key: string) => String(formData.get(key) ?? "").trim();

  const para = value("para");
  const location = value("location");
  const title = value("title");
  const description = value("description");

  if (!para || !location || !title || !description) {
    return { ok: false, error: "Please fill in your para, location, gem name and description." };
  }

  const phone = value("phone");
  if (!phone) {
    return { ok: false, error: "Verify your mobile number before submitting." };
  }

  const upload = value("upload");
  await createSubmission({
    para,
    location,
    title,
    category: value("category") || "Uncategorised",
    description,
    phone,
    upload: upload || undefined,
    uploadType: upload ? (value("uploadType") as "image" | "video") : undefined,
    uploadName: value("uploadName") || undefined,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  return { ok: true };
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

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${id}`);
}

export async function removeSubmission(id: string) {
  await requireAdmin();
  await deleteSubmission(id);
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
}
