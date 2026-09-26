import { Hero } from "@/components/hero/Hero";
import { VerticalsSection } from "@/components/verticals/VerticalsSection";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeResearch } from "@/components/home/HomeResearch";
import { HomeVentures } from "@/components/home/HomeVentures";
import { FundingCallout } from "@/components/home/FundingCallout";
import { ImpactSection } from "@/components/impact/ImpactSection";
import { HomePrograms } from "@/components/home/HomePrograms";
import { FromTheGallery } from "@/components/gallery/FromTheGallery";
import { getPeople, getSite } from "@/lib/data";

/**
 * The homepage presents the Centre's identity — who, what, how and what comes out of it.
 * Full collections live on their own pages; collaboration pathways live on /contact.
 */
export default async function HomePage() {
  const [site, faculty] = await Promise.all([getSite(), getPeople("Faculty")]);

  const heroFacts = [
    { label: "An interdisciplinary centre at", value: "IIT Jodhpur" },
    { label: "Two verticals", value: "Medical Technologies · Digital Health" },
    { label: "Clinical partnership", value: "AIIMS Jodhpur" },
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
      <section aria-label="From the gallery" className="section-y border-t border-line">
        <FromTheGallery />
      </section>
    </main>
  );
}
