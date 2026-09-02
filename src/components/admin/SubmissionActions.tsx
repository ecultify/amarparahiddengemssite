"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, Gem, Loader2, Trash2, Undo2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { removeSubmission, setSubmissionStatus } from "@/app/actions/submissions";
import type { SubmissionStatus } from "@/lib/submissions";

export function SubmissionActions({
  id,
  status,
  afterDelete,
}: {
  id: string;
  status: SubmissionStatus;
  afterDelete?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const MESSAGES: Record<SubmissionStatus, string> = {
    approved: "Marked approved",
    rejected: "Marked rejected",
    new: "Moved back to new",
    counted: "Pushed into the 500. The public counter moved up by one.",
  };

  const set = (next: SubmissionStatus) =>
    startTransition(async () => {
      await setSubmissionStatus(id, next);
      toast.success(
        status === "counted" && next !== "counted"
          ? "Pulled out of the 500. The public counter moved down by one."
          : MESSAGES[next],
      );
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}

      {status !== "counted" ? (
        <Button size="sm" onClick={() => set("counted")} disabled={pending}>
          <Gem className="size-3.5" /> Push into the 500
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => set("approved")} disabled={pending}>
          <Undo2 className="size-3.5" /> Pull out of the 500
        </Button>
      )}

      {status !== "approved" && status !== "counted" ? (
        <Button size="sm" variant="outline" onClick={() => set("approved")} disabled={pending}>
          <Check className="size-3.5" /> Approve
        </Button>
      ) : null}

      {status !== "rejected" && status !== "counted" ? (
        <Button size="sm" variant="outline" onClick={() => set("rejected")} disabled={pending}>
          <X className="size-3.5" /> Reject
        </Button>
      ) : null}

      {status !== "new" ? (
        <Button size="sm" variant="ghost" onClick={() => set("new")} disabled={pending}>
          <Undo2 className="size-3.5" /> Move back to new
        </Button>
      ) : null}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>
              The entry is removed permanently. The visitor&apos;s uploaded file stays in storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                startTransition(async () => {
                  await removeSubmission(id);
                  toast.success("Submission deleted");
                  if (afterDelete) router.push(afterDelete);
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
