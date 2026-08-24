"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { saveCollection } from "@/app/actions/content";
import { emptyItem, type Collection } from "@/lib/schema";

type Item = Record<string, string>;

export function CollectionEditor({
  collection,
  initialItems,
}: {
  collection: Collection;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  const update = (next: Item[]) => {
    setItems(next);
    setDirty(true);
  };

  const patch = (index: number, key: string, value: string) =>
    update(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const save = () =>
    startTransition(async () => {
      try {
        await saveCollection(collection.key, items);
        setDirty(false);
        toast.success(`${collection.label} published`, { description: "The live site is updated." });
      } catch {
        toast.error("Couldn't save", { description: "Check your connection and try again." });
      }
    });

  return (
    <div className="flex flex-col gap-5">
      <div className="sticky top-0 z-30 -mx-5 flex items-center justify-between gap-3 border-b bg-background/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mt-4">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "entry" : "entries"}
          {dirty ? <span className="ml-2 font-medium text-foreground">• unsaved changes</span> : null}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => update([...items, emptyItem(collection)])}
          >
            <Plus className="size-3.5" /> Add {collection.singular.toLowerCase()}
          </Button>
          <Button size="sm" onClick={save} disabled={!dirty || pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {pending ? "Publishing…" : "Publish changes"}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No entries yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This section is hidden on the site until you add one.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            size="sm"
            onClick={() => update([emptyItem(collection)])}
          >
            <Plus className="size-3.5" /> Add {collection.singular.toLowerCase()}
          </Button>
        </div>
      ) : null}

      {items.map((item, index) => (
        <article key={index} className="rounded-lg border bg-card">
          <header className="flex items-center gap-2 border-b px-4 py-2.5">
            <GripVertical className="size-4 text-muted-foreground" aria-hidden />
            <h2 className="truncate text-sm font-semibold">
              {item[collection.titleKey] || `Untitled ${collection.singular.toLowerCase()}`}
            </h2>
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move down"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Delete entry">
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete “{item[collection.titleKey] || "this entry"}”?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      It disappears from the site the next time you publish. Uploaded files stay in
                      storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => update(items.filter((_, i) => i !== index))}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </header>

          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {collection.fields.map((field) => {
              const id = `${collection.key}-${index}-${field.key}`;
              const value = item[field.key] ?? "";
              const wide = field.type === "textarea" || field.type === "image" || field.type === "video";

              return (
                <div key={field.key} className={`flex flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor={id}>{field.label}</Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={id}
                      rows={4}
                      value={value}
                      onChange={(event) => patch(index, field.key, event.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <Select value={value} onValueChange={(next) => patch(index, field.key, next)}>
                      <SelectTrigger id={id}>
                        <SelectValue placeholder="Choose…" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "image" || field.type === "video" ? (
                    <MediaField
                      id={id}
                      value={value}
                      kind={field.type}
                      onChange={(next) => patch(index, field.key, next)}
                    />
                  ) : (
                    <Input
                      id={id}
                      value={value}
                      onChange={(event) => patch(index, field.key, event.target.value)}
                    />
                  )}

                  {field.help ? (
                    <p className="text-xs text-muted-foreground">{field.help}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
