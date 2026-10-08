/** Page numbers to render, with gaps collapsed to an ellipsis once the
 *  gallery outgrows a single row of buttons. */
export function pageList(current: number, last: number): (number | "gap")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const near = [current - 1, current, current + 1].filter((n) => n > 1 && n < last);
  const out: (number | "gap")[] = [1];
  if (near[0] > 2) out.push("gap");
  out.push(...near);
  if (near[near.length - 1] < last - 1) out.push("gap");
  out.push(last);
  return out;
}

/** Clamp a requested page to what the list actually has, and slice to it. */
export function paginate<T>(rows: T[], requested: number, perPage: number) {
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  // `requested` can come straight off the URL, so NaN and fractions are
  // possible; both settle to a whole page inside the range.
  const wanted = Number.isFinite(requested) ? Math.trunc(requested) : 1;
  const page = Math.min(Math.max(1, wanted), pageCount);
  return { page, pageCount, slice: rows.slice((page - 1) * perPage, page * perPage) };
}
