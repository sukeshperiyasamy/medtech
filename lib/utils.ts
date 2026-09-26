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

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Faculty portraits are hosted by IIT Jodhpur. Its server sends an incomplete TLS
 * certificate chain, so server-side fetches (Next's image optimiser, incl. on Vercel) fail,
 * while browsers load them fine. These images are therefore loaded directly by the
 * browser (lazily). If re-use permission is granted, host optimised copies locally instead.
 */
export const isIitjHosted = (src: string) => src.startsWith("https://www.iitj.ac.in/");
