import { Hero } from "@/components/hero/Hero";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeResearch } from "@/components/home/HomeResearch";
import { HomeVentures } from "@/components/home/HomeVentures";
import { FundingCallout } from "@/components/home/FundingCallout";
import { ImpactSection } from "@/components/impact/ImpactSection";
import { HomePrograms } from "@/components/home/HomePrograms";
import { HomeNews } from "@/components/home/HomeNews";
import { ClosingCta } from "@/components/footer/ClosingCta";
import { getCollaborationPathways, getPeople, getPrograms, getSite } from "@/lib/data";

/**
 * The homepage presents the Center's identity — who, what, how, what comes out of it,
 * and how to engage. Full collections live on their own pages.
 */
export default async function HomePage() {
  const [site, programs, faculty, pathways] = await Promise.all([
    getSite(),
    getPrograms(),
    getPeople("Faculty"),
    getCollaborationPathways(),
  ]);

  const heroFacts = [
    { label: "Jointly offered", value: "IIT Jodhpur & AIIMS Jodhpur" },
    { label: "Cohort model", value: "Equal seats — medical & engineering" },
    { label: "Programmes", value: programs.map((p) => p.shortTitle).join(" · ") },
    { label: "Affiliated faculty", value: `${faculty.length} at IIT Jodhpur` },
  ];

  return (
    <main id="main">
      <Hero site={site} facts={heroFacts} />
      <HomeAbout index="01" />
      <HomeResearch index="02" />
      <HomeVentures index="03" />
      <FundingCallout />
      <ImpactSection index="04" />
      <HomePrograms index="05" />
      <HomeNews index="06" />
      <ClosingCta site={site} programs={programs} pathways={pathways} />
    </main>
  );
}
