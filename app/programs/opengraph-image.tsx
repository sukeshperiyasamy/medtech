import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Programmes — Medical Technology Centre";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ eyebrow: "Programmes", title: "Doctors and engineers, in the same classroom.", subtitle: "Master's and PhD in Medical Technologies" });
}