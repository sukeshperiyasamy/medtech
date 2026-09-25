import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Absolute URL for a site path. The site lives under a sub-path, so relative URLs
 * (which Next resolves against the origin) would drop "/medical-technologies".
 */
export const absoluteUrl = (path = "/") => site.url.replace(/\/$/, "") + (path === "/" ? "" : path);

/** Per-page metadata with canonical URL and social cards. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
