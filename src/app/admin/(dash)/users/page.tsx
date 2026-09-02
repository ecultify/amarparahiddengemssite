import Link from "next/link";
import { UsersRound } from "lucide-react";
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
import { listSubmissions } from "@/lib/submissions";
import { listUsers, type QuizUser } from "@/lib/users";

/** Every verified number, with what they did: gems submitted and every
 *  Guess the Para answer. */
export default async function UsersPage() {
  const [users, submissions] = await Promise.all([listUsers(), listSubmissions()]);

  // Submitters from before user records existed still deserve a row.
  const known = new Set(users.map((user) => user.phone));
  const legacy: QuizUser[] = submissions
    .filter((s) => s.phone && !known.has(s.phone.replace(/\D/g, "")))
    .map((s) => ({
      phone: s.phone!.replace(/\D/g, ""),
      firstSeen: s.createdAt,
      lastSeen: s.createdAt,
      guesses: {},
    }))
    .filter((user, index, all) => all.findIndex((u) => u.phone === user.phone) === index);

  const rows = [...users, ...legacy]
    .map((user) => ({
      ...user,
      gems: submissions.filter((s) => (s.phone ?? "").replace(/\D/g, "") === user.phone),
      guesses: Object.values(user.guesses ?? {}).sort((a, b) => b.day - a.day),
    }))
    .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who verified a number, with their gem submissions and daily quiz answers.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <UsersRound className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">No verified users yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            A row appears the moment someone verifies their number on the gem form or the quiz.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Last seen</TableHead>
                <TableHead>Gem submissions</TableHead>
                <TableHead>Guess the Para</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user.phone}>
                  <TableCell className="align-top font-medium tabular-nums">{user.phone}</TableCell>
                  <TableCell className="hidden align-top text-muted-foreground tabular-nums lg:table-cell">
                    {formatDate(user.lastSeen)}
                  </TableCell>
                  <TableCell className="align-top">
                    {user.gems.length === 0 ? (
                      <span className="text-muted-foreground">None</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {user.gems.map((gem) => (
                          <Link
                            key={gem.id}
                            href={`/admin/submissions/${gem.id}`}
                            className="flex items-center gap-2 hover:underline"
                          >
                            <span className="truncate">{gem.title}</span>
                            <Badge variant="outline" className={STATUS_TONE[gem.status]}>
                              {STATUS_LABEL[gem.status]}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    {user.guesses.length === 0 ? (
                      <span className="text-muted-foreground">Not played</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {user.guesses.map((guess) => (
                          <div key={guess.day} className="flex items-center gap-2">
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
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
