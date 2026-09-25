import type { MetadataRoute } from "next";
import { getStartups } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

const ROUTES = ["/", "/about", "/research", "/funding", "/startups", "/programs", "/people", "/students", "/news", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ventures = (await getStartups()).map((s) => `/startups/${s.slug}`);
  return [...ROUTES, ...ventures].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/news" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}