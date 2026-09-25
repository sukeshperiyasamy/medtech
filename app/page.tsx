import { Hero } from "@/components/hero/Hero";
import { VerticalsSection } from "@/components/verticals/VerticalsSection";
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
 * The homepage presents the Centre's identity — who, what, how, what comes out of it,
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
    { label: "A centre of", value: "IIT Jodhpur" },
    { label: "Verticals", value: "Medical Technologies · Digital Health" },
    { label: "Clinical partner", value: "AIIMS Jodhpur" },
    { label: "Affiliated faculty", value: `${faculty.length} at IIT Jodhpur` },
  ];

  return (
    <main id="main">
      <Hero site={site} facts={heroFacts} />
      <VerticalsSection index="01" showPhoto />
      <HomeAbout index="02" />
      <HomeResearch index="03" />
      <HomeVentures index="04" />
      <FundingCallout />
      <ImpactSection index="05" />
      <HomePrograms index="06" />
      <HomeNews index="07" />
      <ClosingCta site={site} programs={programs} pathways={pathways} />
    </main>
  );
}
