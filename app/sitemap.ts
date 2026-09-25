import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Phase 1 ships the homepage. Internal routes (/research, /programs, /people, /funding,
// /innovation, /news, /contact …) are added here as they are built.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
