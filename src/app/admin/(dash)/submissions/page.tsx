import Link from "next/link";
import { Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSubmissions, type SubmissionStatus } from "@/lib/submissions";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Pager } from "@/components/admin/Pager";
import { SearchInput } from "@/components/admin/SearchInput";
import { STATUS_LABEL } from "@/components/admin/format";
import { paginate } from "@/lib/paginate";
import { search } from "@/lib/search";

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
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const { status, page: pageParam, q = "" } = await searchParams;
  const active = FILTERS.some((filter) => filter.key === status) ? status! : "all";
  // The tab counts follow the search, so they say how many matches each holds.
  const all = search(await listSubmissions(), q, (entry) => [
    { text: entry.name, weight: 3 },
    { text: entry.phone, phone: true },
    { text: entry.para, weight: 2 },
    { text: entry.location, weight: 2 },
    { text: entry.title, weight: 2 },
    { text: entry.category },
    { text: STATUS_LABEL[entry.status] },
    { text: entry.source },
    { text: entry.description, weight: 0.5 },
  ]);
  const rows = active === "all" ? all : all.filter((entry) => entry.status === active);
  const { page, pageCount, slice } = paginate(rows, Number(pageParam) || 1, PER_PAGE);

  // The filter and search live in the URL too, so tab and pager links start from them.
  const hrefFor = (key: string) => {
    const query = new URLSearchParams();
    if (key !== "all") query.set("status", key);
    if (q) query.set("q", q);
    return query.size ? `/admin/submissions?${query}` : "/admin/submissions";
  };
  const listHref = hrefFor(active);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Submissions</h1>
        <p className="text-sm text-muted-foreground">
          Every entry from the public form, newest first.
        </p>
      </header>

      <SearchInput param="q" placeholder="Search name, phone, para, gem…" />

      <Tabs value={active}>
        <TabsList>
          {FILTERS.map((filter) => (
            <TabsTrigger key={filter.key} value={filter.key} asChild>
              <Link href={hrefFor(filter.key)}>
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
            {q
              ? `No ${active === "all" ? "" : `${active} `}submissions match “${q}”.`
              : active === "all"
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
