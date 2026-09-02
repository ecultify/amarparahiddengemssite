"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaField } from "@/components/admin/MediaField";
import type { Collection } from "@/lib/schema";

type Item = Record<string, string>;

/** The edit modal for one collection entry. Works on a draft copy; nothing
 *  touches the list until Save. */
export function EntryDialog({
  collection,
  item,
  open,
  saving,
  onSave,
  onClose,
}: {
  collection: Collection;
  /** null = the dialog is closed with no entry loaded. */
  item: Item | null;
  open: boolean;
  saving: boolean;
  onSave: (draft: Item) => void;
  onClose: () => void;
}) {
  // The parent keys this component per opened entry, so a fresh mount (and a
  // fresh draft) happens every time the dialog opens on something else.
  const [draft, setDraft] = useState<Item>(() => item ?? {});

  const patch = (key: string, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  const isNew = item !== null && !item[collection.titleKey];

  return (
    <Dialog open={open} onOpenChange={(next) => (!next && !saving ? onClose() : undefined)}>
      {/* Header and footer stay put; only the fields in between scroll. */}
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>
            {isNew
              ? `New ${collection.singular.toLowerCase()}`
              : draft[collection.titleKey] || `Edit ${collection.singular.toLowerCase()}`}
          </DialogTitle>
          <DialogDescription>{collection.where}</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 auto-rows-min gap-4 overflow-x-hidden overflow-y-auto px-6 py-5 sm:grid-cols-2">
          {collection.fields.map((field) => {
            const id = `entry-${field.key}`;
            const value = draft[field.key] ?? "";
            const wide =
              field.type === "textarea" || field.type === "image" || field.type === "video";

            return (
              <div key={field.key} className={`flex min-w-0 flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
                <Label htmlFor={id}>{field.label}</Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={id}
                    rows={4}
                    value={value}
                    onChange={(event) => patch(field.key, event.target.value)}
                  />
                ) : field.type === "select" ? (
                  <Select value={value} onValueChange={(next) => patch(field.key, next)}>
                    <SelectTrigger id={id} className="w-full">
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
                    onChange={(next) => patch(field.key, next)}
                  />
                ) : (
                  <Input
                    id={id}
                    value={value}
                    onChange={(event) => patch(field.key, event.target.value)}
                  />
                )}

                {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
              </div>
            );
          })}
        </div>

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button type="button" variant="outline" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={saving} onClick={() => onSave(draft)}>
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {saving ? "Publishing…" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
