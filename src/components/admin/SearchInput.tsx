"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Search box for the admin lists. Two modes, like the Pager: `param` keeps the
 * query in the URL under that name (server-filtered lists, so the filter
 * survives a refresh and the tabs and pager links carry it); `onChange` just
 * hands the text up (client lists).
 */
type Props = {
  placeholder: string;
  param?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchInput({ placeholder, param, value, onChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fromUrl = param ? (params.get(param) ?? "") : "";
  const [text, setText] = useState(param ? fromUrl : (value ?? ""));

  // Typing settles for a moment before the URL (and the server render) moves.
  useEffect(() => {
    if (!param || text.trim() === fromUrl.trim()) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (text.trim()) next.set(param, text.trim());
      else next.delete(param);
      next.delete("page"); // new results start on page 1
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [text, param, fromUrl, params, pathname, router]);

  const set = (next: string) => {
    setText(next);
    onChange?.(next);
  };

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(event) => set(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && set("")}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <button
          type="button"
          onClick={() => set("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
