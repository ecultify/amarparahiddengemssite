import Link from "next/link";
import { Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSubmissions, type SubmissionStatus } from "@/lib/submissions";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Pager } from "@/components/admin/Pager";
import { paginate } from "@/lib/paginate";

const PER_PAGE = 25;

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
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageParam } = await searchParams;
  const active = FILTERS.some((filter) => filter.key === status) ? status! : "all";
  const all = await listSubmissions();
  const rows = active === "all" ? all : all.filter((entry) => entry.status === active);
  const { page, pageCount, slice } = paginate(rows, Number(pageParam) || 1, PER_PAGE);

  // The filter lives in the URL too, so the pager's links start from it.
  const listHref = active === "all" ? "/admin/submissions" : `/admin/submissions?status=${active}`;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Submissions</h1>
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
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
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
          <SubmissionsTable rows={slice} />
          <Pager
            page={page}
            pageCount={pageCount}
            total={rows.length}
            perPage={PER_PAGE}
            noun="submissions"
            href={listHref}
          />
        </div>
      )}
    </div>
  );
}
