/** Give every <h2> in an article body an id so the page can link to it, and
 *  return those headings for the table of contents. Ids are derived from the
 *  heading text; a repeat gets a numeric suffix so anchors stay unique. */
export function withHeadingIds(html: string): { html: string; sections: { id: string; text: string }[] } {
  const sections: { id: string; text: string }[] = [];
  const seen = new Map<string, number>();
  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (_match, attrs: string = "", inner: string) => {
    // The TOC renders this as plain text, so entities must be decoded (&amp; last).
    const text = inner
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    const base =
      text.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const id = n ? `${base}-${n + 1}` : base;
    sections.push({ id, text });
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html: out, sections };
}
