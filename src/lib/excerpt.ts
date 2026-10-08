/** First sentences of an article body, trimmed to a length search engines
 *  will actually show, for use when an editor has not written a custom
 *  meta description. */
export function excerpt(html: string, limit = 155) {
  const text = (html ?? "")
    .replace(/<[^>]*>/g, " ")
    // Entities the article bodies actually carry, so the snippet reads as prose.
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    // Tags become spaces so words never run together, which leaves a gap in
    // front of any punctuation that followed a closing tag.
    .replace(/ +([,.;:!?])/g, "$1")
    .trim();
  if (text.length <= limit) return text;
  // Cut on a word, not mid-word, and drop any dangling punctuation.
  const cut = text.slice(0, limit);
  const end = cut.lastIndexOf(" ");
  return (end > 0 ? cut.slice(0, end) : cut).replace(/[\s,;:.\-–—]+$/, "") + "…";
}
