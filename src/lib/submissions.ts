import { readJson, readJsonCollection, removeBlob, writeJson } from "@/lib/blob-store";

export type SubmissionStatus = "new" | "approved" | "rejected";

export type Submission = {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  para: string;
  location: string;
  title: string;
  category: string;
  description: string;
  /** Verified at submission time; how a published gem gets credited. */
  phone?: string;
  /** Blob URL of the visitor's upload, if they attached one. */
  upload?: string;
  uploadType?: "image" | "video";
  uploadName?: string;
};

const PREFIX = "submissions/";
const pathFor = (id: string) => `${PREFIX}${id}.json`;

/** Sorts newest-first because ids are timestamp-prefixed. */
export const listSubmissions = () => readJsonCollection<Submission>(PREFIX);

export const getSubmission = (id: string) => readJson<Submission>(pathFor(id));

export async function createSubmission(input: Omit<Submission, "id" | "createdAt" | "status">) {
  const createdAt = new Date().toISOString();
  // Timestamp-prefixed id: one blob per submission, so concurrent entries
  // can never overwrite each other and the list sorts without an index.
  const id = `${createdAt.replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`;
  const submission: Submission = { ...input, id, createdAt, status: "new" };
  await writeJson(pathFor(id), submission);
  return submission;
}

export async function updateSubmission(id: string, patch: Partial<Submission>) {
  const current = await getSubmission(id);
  if (!current) return null;
  const next = { ...current, ...patch, id: current.id };
  await writeJson(pathFor(id), next);
  return next;
}

export const deleteSubmission = (id: string) => removeBlob(pathFor(id));
