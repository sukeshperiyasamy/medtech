import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getStartup } from "@/lib/data";

export const alt = "Venture profile — Medical Technology Centre";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getStartup((await params).slug);
  return ogCard({ eyebrow: "Student & Faculty Ventures", title: s?.name ?? "Venture profile", subtitle: s?.tagline });
}