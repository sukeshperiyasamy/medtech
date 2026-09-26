import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Absolute URL for a site path. Built by hand (not via metadataBase) because the site may
 * live under a sub-path, which Next would drop when resolving "/…" URLs.
 */
export const absoluteUrl = (path = "/") => site.url.replace(/\/$/, "") + (path === "/" ? "" : path);


/**
 * Per-page metadata: title, description, canonical, Open Graph and X (Twitter) cards.
 * Share images come from each route's opengraph-image / twitter-image files.
 */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: site.name,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
