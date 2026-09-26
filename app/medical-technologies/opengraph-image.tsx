import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Medical Technologies Program, IIT Jodhpur × AIIMS Jodhpur";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: "Vertical 01 · IIT Jodhpur × AIIMS Jodhpur", title: "Medical Technologies Program", subtitle: "Master's and PhD in Medical Technologies" });
}