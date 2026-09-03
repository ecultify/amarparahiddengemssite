import { UsersRound } from "lucide-react";
import { UsersTable } from "@/components/admin/UsersTable";
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
          Everyone who verified a number. Click a row to see what they submitted and guessed.
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
        <UsersTable rows={rows} />
      )}
    </div>
  );
}
