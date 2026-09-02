"use client";

import { useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moveArticle } from "@/app/actions/content";

export function MoveArticleButtons({
  slug,
  first,
  last,
}: {
  slug: string;
  first: boolean;
  last: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const move = (direction: -1 | 1) => startTransition(() => moveArticle(slug, direction));

  return (
    <div className="flex shrink-0 items-center">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Move up"
        disabled={first || pending}
        onClick={() => move(-1)}
      >
        <ArrowUp className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Move down"
        disabled={last || pending}
        onClick={() => move(1)}
      >
        <ArrowDown className="size-4" />
      </Button>
    </div>
  );
}
