import { StartupsHero } from "@/components/startups/StartupsHero";
import { StartupsMetricsBar } from "@/components/startups/StartupsMetricsBar";
import { FeaturedVentures } from "@/components/startups/FeaturedVentures";
import { ResearchToVenturePathway } from "@/components/startups/ResearchToVenturePathway";
import { StartupsDirectory } from "@/components/startups/StartupsDirectory";
import { StartupsCTA } from "@/components/startups/StartupsCTA";
import { getPeopleByIds, getResearchAreas, getSite, getStartups, getTrlScale } from "@/lib/data";
import type { ResolvedStartup } from "@/components/startups/StartupShowcase";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Startups & Innovation",
  "Ventures founded by IIT Jodhpur faculty and scholars in clinical partnership with AIIMS Jodhpur — medical devices, digital diagnostics, filed patent applications, and venture-backed translation.",
  "/startups",
);

export default async function StartupsPage() {
  const [startups, areas, scale, site] = await Promise.all([
    getStartups(),
    getResearchAreas(),
    getTrlScale(),
    getSite(),
  ]);

  const resolved: ResolvedStartup[] = await Promise.all(
    startups.map(async (s) => ({
      ...s,
      areaTitle: areas.find((a) => a.id === s.researchAreaId)?.shortTitle,
      mentors: (await getPeopleByIds(s.mentorIds)).map(({ id, name, designation }) => ({
        id,
        name,
        designation,
      })),
    })),
  );

  return (
    <main id="main">
      {/* Editorial Hero */}
      <StartupsHero />

      {/* Restrained Ecosystem Metric Strip */}
      <StartupsMetricsBar startups={resolved} />

      {/* 01: Featured Venture Storytelling */}
      <FeaturedVentures startups={resolved} />

      {/* 02: Research-to-Venture Pathway */}
      <ResearchToVenturePathway />

      {/* 03: Complete Venture Registry & Searchable Directory */}
      <StartupsDirectory startups={resolved} scale={scale} email={site.email} />

      {/* Final Editorial Call to Action */}
      <StartupsCTA contactEmail={site.email} />
    </main>
  );
}