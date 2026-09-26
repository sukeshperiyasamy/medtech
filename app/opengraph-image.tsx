import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Medical Technology Centre, IIT Jodhpur";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: "IIT Jodhpur", title: "Engineering the future of medicine.", subtitle: "Where clinical insight, engineering and entrepreneurship come together to create technologies for real-world healthcare." });
}