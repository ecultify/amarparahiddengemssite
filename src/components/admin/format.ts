import type { SubmissionStatus } from "@/lib/submissions";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/** One status vocabulary across the inbox, detail view and dashboard. */
export const STATUS_TONE: Record<SubmissionStatus, string> = {
  new: "border-pink/30 bg-pink/10 text-pink",
  approved: "border-grass/30 bg-grass/10 text-grass",
  rejected: "border-muted-foreground/30 bg-muted text-muted-foreground",
  counted: "border-cyan/30 bg-cyan/10 text-cyan",
};

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "new",
  approved: "approved",
  rejected: "rejected",
  counted: "in the 500",
};
