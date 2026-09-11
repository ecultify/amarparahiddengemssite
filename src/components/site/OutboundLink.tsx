"use client";

import { track } from "@/lib/track";

/** An external link that reports the click before the browser leaves. */
export function OutboundLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track({ event: "outbound_click", link_url: href, link_text: label })}
    >
      {children}
    </a>
  );
}
