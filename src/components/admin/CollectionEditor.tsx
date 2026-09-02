"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { EntryDialog } from "@/components/admin/EntryDialog";
import { saveCollection } from "@/app/actions/content";
import { emptyItem, type Collection } from "@/lib/schema";

type Item = Record<string, string>;

/** Collection manager: one compact row per entry, click to edit in a modal.
 *  Every change (save, reorder, delete) publishes to the live site at once —
 *  the same immediate model as the articles editor. */
export function CollectionEditor({
  collection,
  initialItems,
}: {
  collection: Collection;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  // Index being edited; -1 = a new entry; null = dialog closed.
  const [editing, setEditing] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  const imageKey = collection.fields.find((f) => f.type === "image")?.key;
  const subtitleFields = collection.fields
    .filter((f) => (f.type === "text" || f.type === "select") && f.key !== collection.titleKey)
    .slice(0, 2);

  const persist = (next: Item[], done?: () => void) =>
    startTransition(async () => {
      try {
        await saveCollection(collection.key, next);
        setItems(next);
        done?.();
        toast.success("Published", { description: "The live site is updated." });
      } catch {
        toast.error("Couldn't save", { description: "Check your connection and try again." });
      }
    });

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  };

  const saveEntry = (draft: Item) => {
    const next =
      editing === -1 ? [...items, draft] : items.map((item, i) => (i === editing ? draft : item));
    persist(next, () => setEditing(null));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "entry" : "entries"} · every change publishes straight to the live site
        </p>
        <Button size="sm" onClick={() => setEditing(-1)}>
          <Plus className="size-3.5" /> Add {collection.singular.toLowerCase()}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No entries yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This section stays hidden on the site until you add one.
          </p>
          <Button className="mt-4" variant="outline" size="sm" onClick={() => setEditing(-1)}>
            <Plus className="size-3.5" /> Add {collection.singular.toLowerCase()}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-lg border bg-card">
          {items.map((item, index) => {
            const subtitle = subtitleFields
              .map((f) => item[f.key])
              .filter(Boolean)
              .join(" · ");
            return (
              <div key={index} className="flex items-center gap-3 px-4 py-3">
                {imageKey && item[imageKey] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item[imageKey]}
                    alt=""
                    className="size-12 shrink-0 rounded-md border object-cover"
                  />
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md border bg-muted">
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setEditing(index)}
                  className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-sm text-left outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="truncate text-sm font-semibold">
                    {item[collection.titleKey] || `Untitled ${collection.singular.toLowerCase()}`}
                  </span>
                  {subtitle ? (
                    <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
                  ) : null}
                </button>

                <div className="flex shrink-0 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Move up"
                    disabled={index === 0 || pending}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Move down"
                    disabled={index === items.length - 1 || pending}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete entry"
                        disabled={pending}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete “{item[collection.titleKey] || "this entry"}”?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          It disappears from the live site immediately. Uploaded files stay in
                          storage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => persist(items.filter((_, i) => i !== index))}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EntryDialog
        key={editing ?? "closed"}
        collection={collection}
        item={editing === null ? null : editing === -1 ? emptyItem(collection) : items[editing]}
        open={editing !== null}
        saving={pending}
        onSave={saveEntry}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
