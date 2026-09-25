export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "15 Feb 2025" or "15–17 Feb 2025" for ranges within a month. */
export function formatDateRange(start: string, end?: string) {
  const s = new Date(start + "T00:00:00");
  if (!end) return dateFmt.format(s);
  const e = new Date(end + "T00:00:00");
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${dateFmt.format(e)}`;
  }
  return `${dateFmt.format(s)} – ${dateFmt.format(e)}`;
}

/**
 * Official photos are hot-linked from iitj.ac.in, which resolves to a private IP on the
 * campus network — Next's optimiser refuses that (SSRF guard). Let the browser fetch
 * them directly until they are moved to local/object storage.
 */
export const isRemote = (src: string) => /^https?:\/\//.test(src);

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
