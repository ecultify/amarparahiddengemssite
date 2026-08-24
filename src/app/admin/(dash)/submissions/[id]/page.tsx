import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SubmissionActions } from "@/components/admin/SubmissionActions";
import { formatDate, STATUS_TONE } from "@/components/admin/format";
import { getSubmission } from "@/lib/submissions";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getSubmission(id);
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link href="/admin/submissions">
          <ArrowLeft className="size-3.5" /> All submissions
        </Link>
      </Button>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">{entry.title}</h1>
          <p className="text-sm text-muted-foreground">
            {entry.para} · received {formatDate(entry.createdAt)}
          </p>
        </div>
        <Badge variant="outline" className={STATUS_TONE[entry.status]}>
          {entry.status}
        </Badge>
      </header>

      <SubmissionActions id={entry.id} status={entry.status} afterDelete="/admin/submissions" />

      <Separator />

      <dl className="flex flex-col gap-3">
        <Row label="Para" value={entry.para} />
        <Row label="Location" value={entry.location} />
        <Row label="Category" value={entry.category} />
      </dl>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Description</h2>
        <p className="max-w-[70ch] text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {entry.description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Upload</h2>
        {entry.upload ? (
          <div className="flex flex-col items-start gap-3">
            <div className="overflow-hidden rounded-lg border bg-muted">
              {entry.uploadType === "video" ? (
                <video src={entry.upload} controls className="max-h-[420px] w-full max-w-xl" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.upload}
                  alt={entry.uploadName ?? entry.title}
                  className="max-h-[420px] w-full max-w-xl object-contain"
                />
              )}
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={entry.upload} download target="_blank" rel="noreferrer">
                <Download className="size-3.5" /> {entry.uploadName ?? "Download file"}
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No file attached.</p>
        )}
      </div>
    </div>
  );
}
