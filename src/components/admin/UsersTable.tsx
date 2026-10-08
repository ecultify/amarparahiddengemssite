"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
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
import { Pager } from "@/components/admin/Pager";
import { SearchInput } from "@/components/admin/SearchInput";
import { paginate } from "@/lib/paginate";
import { istDateLabel } from "@/lib/quiz";
import { search } from "@/lib/search";
import type { Submission } from "@/lib/submissions";
import type { Guess } from "@/lib/users";
import { removeUser } from "@/app/actions/submissions";

export type UserRow = {
  phone: string;
  name?: string;
  lastSeen: string;
  gems: Submission[];
  guesses: Guess[];
};

/** One row per verified number. Everything that number did is folded away
 *  until the row is opened, so the table stays one line per person. */
const PER_PAGE = 25;

export function UsersTable({ rows: everyone }: { rows: UserRow[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [requested, setRequested] = useState(1);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  // A person is found by who they are or by anything they submitted, so a
  // para name lists everyone who sent in a gem from there.
  const rows = useMemo(
    () =>
      search(everyone, query, (user) => [
        { text: user.name, weight: 3 },
        { text: user.phone, phone: true },
        ...user.gems.flatMap((gem) => [
          { text: gem.para, weight: 2 },
          { text: gem.location, weight: 2 },
          { text: gem.title },
          { text: gem.category },
        ]),
      ]),
    [everyone, query],
  );
  const { page, pageCount, slice } = paginate(rows, requested, PER_PAGE);

  // A fragment: the page's flex column spaces the search box and the table.
  return (
    <>
    <SearchInput
      placeholder="Search name, phone, or a para they submitted…"
      onChange={(next) => {
        setQuery(next);
        setRequested(1);
        setOpen(null);
      }}
    />
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden lg:table-cell">Last seen</TableHead>
            <TableHead>Gem submissions</TableHead>
            <TableHead>Guess the Para</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                No one matches “{query.trim()}”.
              </TableCell>
            </TableRow>
          ) : null}
          {slice.map((user) => {
            const isOpen = open === user.phone;
            return (
              <Fragment key={user.phone}>
                <TableRow
                  onClick={() => setOpen(isOpen ? null : user.phone)}
                  aria-expanded={isOpen}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <ChevronRight
                      className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name ?? <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="tabular-nums">{user.phone}</TableCell>
                  <TableCell className="hidden text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(user.lastSeen)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.gems.length === 0
                      ? "None"
                      : `${user.gems.length} ${user.gems.length === 1 ? "gem" : "gems"}`}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.guesses.length === 0
                      ? "Not played"
                      : `${user.guesses.filter((g) => g.correct).length} of ${user.guesses.length} right`}
                  </TableCell>
                </TableRow>

                {isOpen ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="bg-muted/40 p-0">
                      <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Gem submissions
                          </p>
                          {user.gems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              This number has not submitted a gem.
                            </p>
                          ) : (
                            user.gems.map((gem) => (
                              <Link
                                key={gem.id}
                                href={`/admin/submissions/${gem.id}`}
                                className="flex items-center gap-2 text-sm hover:underline"
                              >
                                <span className="truncate">{gem.title}</span>
                                <Badge variant="outline" className={STATUS_TONE[gem.status]}>
                                  {STATUS_LABEL[gem.status]}
                                </Badge>
                                <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                                  {formatDate(gem.createdAt)}
                                </span>
                              </Link>
                            ))
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Guess the Para
                          </p>
                          {user.guesses.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              This number has not played the quiz.
                            </p>
                          ) : (
                            user.guesses.map((guess) => (
                              <div key={guess.day} className="flex items-center gap-2 text-sm">
                                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                  {istDateLabel(guess.day)}
                                </span>
                                <span className="truncate">{guess.choiceLabel}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    guess.correct
                                      ? "border-grass/30 bg-grass/10 text-grass"
                                      : "border-red/30 bg-red/10 text-red"
                                  }
                                >
                                  {guess.correct ? "right" : "wrong"}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end border-t px-6 py-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              disabled={pending}
                            >
                              <Trash2 className="size-3.5" /> Delete user
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {user.name ?? user.phone}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Their record, quiz answers and{" "}
                                {user.gems.length === 0
                                  ? "any submissions"
                                  : `all ${user.gems.length} of their ${user.gems.length === 1 ? "submission" : "submissions"}`}{" "}
                                are removed permanently. Uploaded files stay in storage.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep them</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  startTransition(async () => {
                                    await removeUser(user.phone);
                                    setOpen(null);
                                    toast.success("User deleted");
                                  })
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
      <Pager
        page={page}
        pageCount={pageCount}
        total={rows.length}
        perPage={PER_PAGE}
        noun="people"
        onChange={(next) => {
          setRequested(next);
          setOpen(null); // an open row belongs to the page you are leaving
        }}
      />
    </div>
    </>
  );
}
