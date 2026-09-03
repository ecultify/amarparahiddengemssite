"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, STATUS_LABEL, STATUS_TONE } from "@/components/admin/format";
import { istDateLabel } from "@/lib/quiz";
import type { Submission } from "@/lib/submissions";
import type { Guess } from "@/lib/users";

export type UserRow = {
  phone: string;
  lastSeen: string;
  gems: Submission[];
  guesses: Guess[];
};

/** One row per verified number. Everything that number did is folded away
 *  until the row is opened, so the table stays one line per person. */
export function UsersTable({ rows }: { rows: UserRow[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Phone</TableHead>
            <TableHead className="hidden lg:table-cell">Last seen</TableHead>
            <TableHead>Gem submissions</TableHead>
            <TableHead>Guess the Para</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((user) => {
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
                  <TableCell className="font-medium tabular-nums">{user.phone}</TableCell>
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
                    <TableCell colSpan={5} className="bg-muted/40 p-0">
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
                    </TableCell>
                  </TableRow>
                ) : null}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
