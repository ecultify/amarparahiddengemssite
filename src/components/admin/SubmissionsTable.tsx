"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, STATUS_LABEL, STATUS_TONE } from "@/components/admin/format";
import { removeSubmissions } from "@/app/actions/submissions";
import type { Submission } from "@/lib/submissions";

const CHECK = "size-4 cursor-pointer accent-primary";

/** The inbox rows for one page, with a tick box per row so several entries
 *  can be deleted in one go. Selection is per page: it clears with the rows. */
export function SubmissionsTable({ rows }: { rows: Submission[] }) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const allPicked = rows.length > 0 && rows.every((entry) => picked.has(entry.id));

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      {picked.size > 0 ? (
        <div className="flex items-center justify-between gap-3 border-b px-4 py-2 text-sm">
          <span className="text-muted-foreground">
            {picked.size} selected
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={pending}>
                <Trash2 className="size-3.5" /> Delete {picked.size}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {picked.size} {picked.size === 1 ? "submission" : "submissions"}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The entries are removed permanently. Uploaded files stay in storage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep them</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    startTransition(async () => {
                      const ids = [...picked];
                      await removeSubmissions(ids);
                      setPicked(new Set());
                      toast.success(`${ids.length} deleted`);
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                aria-label="Select all on this page"
                className={CHECK}
                checked={allPicked}
                onChange={() => setPicked(allPicked ? new Set() : new Set(rows.map((entry) => entry.id)))}
              />
            </TableHead>
            <TableHead>Gem</TableHead>
            <TableHead className="hidden sm:table-cell">Para</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Received</TableHead>
            <TableHead>Media</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((entry) => (
            <TableRow key={entry.id} data-state={picked.has(entry.id) ? "selected" : undefined}>
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Select ${entry.title}`}
                  className={CHECK}
                  checked={picked.has(entry.id)}
                  onChange={() => toggle(entry.id)}
                />
              </TableCell>
              <TableCell className="max-w-xs font-medium">
                <Link href={`/admin/submissions/${entry.id}`} className="block truncate" title={entry.title}>
                  {entry.title}
                </Link>
                {entry.name || entry.phone ? (
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {[entry.name, entry.phone].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Link href={`/admin/submissions/${entry.id}`} className="block max-w-[12rem] truncate text-muted-foreground" title={entry.para}>
                  {entry.para}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{entry.category}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground tabular-nums">
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.upload ? (entry.uploadType === "video" ? "Video" : "Photo") : "None"}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className={STATUS_TONE[entry.status]}>
                  {STATUS_LABEL[entry.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
