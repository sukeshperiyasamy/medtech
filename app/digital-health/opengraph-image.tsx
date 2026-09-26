import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Centre for Digital Health, IIT Jodhpur";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: "Vertical 02 · IIT Jodhpur", title: "Centre for Digital Health", subtitle: "Health Equity through Digital Transformation" });
}