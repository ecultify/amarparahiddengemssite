import Link from "next/link";
import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSubmissions, type SubmissionStatus } from "@/lib/submissions";
import { formatDate, STATUS_LABEL, STATUS_TONE } from "@/components/admin/format";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "approved", label: "Approved" },
  { key: "counted", label: "In the 500" },
  { key: "rejected", label: "Rejected" },
];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = FILTERS.some((filter) => filter.key === status) ? status! : "all";
  const all = await listSubmissions();
  const rows = active === "all" ? all : all.filter((entry) => entry.status === active);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
        <p className="text-sm text-muted-foreground">
          Every entry from the public form, newest first.
        </p>
      </header>

      <Tabs value={active}>
        <TabsList>
          {FILTERS.map((filter) => (
            <TabsTrigger key={filter.key} value={filter.key} asChild>
              <Link href={filter.key === "all" ? "/admin/submissions" : `/admin/submissions?status=${filter.key}`}>
                {filter.label}
                <span className="ml-1.5 tabular-nums text-muted-foreground">
                  {filter.key === "all"
                    ? all.length
                    : all.filter((entry) => entry.status === (filter.key as SubmissionStatus)).length}
                </span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <Inbox className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Nothing here</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {active === "all"
              ? "When someone submits a gem at /submit, it shows up in this inbox with their upload."
              : `No ${active} submissions right now.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={entry.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/admin/submissions/${entry.id}`} className="block">
                      {entry.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/admin/submissions/${entry.id}`} className="block text-muted-foreground">
                      {entry.para}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {entry.category}
                  </TableCell>
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
        </div>
      )}
    </div>
  );
}
