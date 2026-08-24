"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, Loader2, Trash2, Undo2, X } from "lucide-react";
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

  const set = (next: SubmissionStatus) =>
    startTransition(async () => {
      await setSubmissionStatus(id, next);
      toast.success(next === "approved" ? "Marked approved" : next === "rejected" ? "Marked rejected" : "Moved back to new");
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}

      {status !== "approved" ? (
        <Button size="sm" onClick={() => set("approved")} disabled={pending}>
          <Check className="size-3.5" /> Approve
        </Button>
      ) : null}

      {status !== "rejected" ? (
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
