"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarIcon, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { MediaField } from "@/components/admin/MediaField";
import { RichText } from "@/components/admin/RichText";
import { deleteArticle, saveArticle } from "@/app/actions/content";
import { articleSlug } from "@/data/site";
import type { ArticleEntry } from "@/lib/content";

const LIST = "/admin/content/articles";

export function ArticleEditor({
  initial,
  originalSlug,
}: {
  initial: ArticleEntry;
  /** null = a new, unsaved article. */
  originalSlug: string | null;
}) {
  const router = useRouter();
  const [article, setArticle] = useState<ArticleEntry>(initial);
  // The slug shadows the headline until it's edited by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(originalSlug));
  const [savedSlug, setSavedSlug] = useState(originalSlug);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const patch = (fields: Partial<ArticleEntry>) => {
    setArticle((a) => ({ ...a, ...fields }));
    setDirty(true);
  };

  // Articles from before the draft workflow carry no status but are live.
  const isLive = savedSlug !== null && article.status !== "draft";

  const save = (status: "draft" | "published") =>
    startTransition(async () => {
      try {
        const result = await saveArticle(savedSlug, { ...article, status });
        if (!result.ok) {
          toast.error("Couldn't save", { description: result.error });
          return;
        }
        setDirty(false);
        setSavedSlug(result.slug);
        // Sync the form with what the server settled on (the slug may have
        // been cleaned up or de-duplicated) without marking it dirty again.
        setArticle((a) => ({ ...a, slug: result.slug, status }));
        if (status === "draft") {
          toast.success("Draft saved", { description: "It is not on the live site." });
        } else {
          toast.success("Article published", { description: `Live at /articles/${result.slug}` });
        }
        // A new article (or a renamed slug) gets its real edit URL.
        router.replace(`${LIST}/${result.slug}`);
      } catch {
        toast.error("Couldn't save", { description: "Check your connection and try again." });
      }
    });

  const remove = () =>
    startTransition(async () => {
      if (!savedSlug) return;
      await deleteArticle(savedSlug);
      toast.success("Article deleted");
      router.push(LIST);
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-30 -mx-5 flex items-center justify-between gap-3 border-b bg-background/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mt-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={LIST}>
            <ArrowLeft className="size-3.5" /> All articles
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {dirty ? <span className="text-sm font-medium">• unsaved changes</span> : null}
          {savedSlug ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Delete article">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{article.title || "this article"}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    It disappears from the site immediately. Uploaded images stay in storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => save("draft")}
            disabled={pending}
          >
            {isLive ? "Unpublish to draft" : "Save draft"}
          </Button>
          <Button size="sm" onClick={() => save("published")} disabled={pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {pending ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="article-title">Headline</Label>
          <Input
            id="article-title"
            value={article.title}
            placeholder="The headline of the piece"
            onChange={(event) => {
              const title = event.target.value;
              patch(slugTouched ? { title } : { title, slug: articleSlug(title) });
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="article-slug">Slug</Label>
          <div className="flex items-center gap-1.5">
            <span className="shrink-0 text-sm text-muted-foreground">/articles/</span>
            <Input
              id="article-slug"
              value={article.slug ?? ""}
              onChange={(event) => {
                setSlugTouched(true);
                patch({ slug: event.target.value });
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Lowercase and hyphens; anything else is cleaned up on publish.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="article-date">Dateline</Label>
          <div className="flex items-center gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="article-date"
                  type="button"
                  variant="outline"
                  className={`flex-1 justify-start font-normal ${article.date ? "" : "text-muted-foreground"}`}
                >
                  <CalendarIcon className="size-4" />
                  {article.date || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDateline(article.date)}
                  defaultMonth={parseDateline(article.date)}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date) patch({ date: formatDateline(date) });
                  }}
                />
              </PopoverContent>
            </Popover>
            {article.date ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear date"
                onClick={() => patch({ date: "" })}
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Shown above the headline on the page.</p>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="article-image">Featured image</Label>
          <MediaField
            id="article-image"
            value={article.image}
            kind="image"
            onChange={(image) => patch({ image })}
          />
          <p className="text-xs text-muted-foreground">
            The cover on the article page and on every card that links to it.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="article-row">Homepage row</Label>
          <Select value={article.row} onValueChange={(row) => patch({ row: row as "1" | "2" })}>
            <SelectTrigger id="article-row" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Row 1</SelectItem>
              <SelectItem value="2">Row 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Which Articles and Features row carries it on the homepage.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Body</Label>
        <RichText value={article.html ?? legacyHtml(article)} onChange={(html) => patch({ html })} />
      </div>

      <fieldset className="flex flex-col gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">SEO</legend>
        <div className="flex flex-col gap-2">
          <Label htmlFor="article-seo-title">Search title</Label>
          <Input
            id="article-seo-title"
            value={article.seoTitle ?? ""}
            placeholder="Defaults to the headline"
            onChange={(event) => patch({ seoTitle: event.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="article-seo-description">Search description</Label>
          <Textarea
            id="article-seo-description"
            rows={3}
            value={article.seoDescription ?? ""}
            placeholder="One or two sentences shown under the title in search results."
            onChange={(event) => patch({ seoDescription: event.target.value })}
          />
        </div>
      </fieldset>
    </div>
  );
}

/** The dateline is stored as display text like "March 4, 2024". */
const formatDateline = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

function parseDateline(value: string | undefined) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/** Older articles carry plain paragraphs; seed the editor with them as HTML. */
function legacyHtml(article: ArticleEntry) {
  const paragraphs = Array.isArray(article.body)
    ? article.body
    : (article.body ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}
