"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createSubmission,
  deleteSubmission,
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

  const upload = value("upload");
  await createSubmission({
    para,
    location,
    title,
    category: value("category") || "Uncategorised",
    description,
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
  await updateSubmission(id, { status });
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
