import { Hero } from "@/components/hero/Hero";
import { HomeAchievements } from "@/components/home/HomeAchievements";
import { VerticalsSection } from "@/components/verticals/VerticalsSection";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeResearch } from "@/components/home/HomeResearch";
import { ImpactSection } from "@/components/impact/ImpactSection";
import { FromTheGallery } from "@/components/gallery/FromTheGallery";
import { getPeople, getSite } from "@/lib/data";

/**
 * The homepage presents the Centre's identity — who, what, how and what comes out of it.
 * Full collections live on their own pages; collaboration pathways live on /contact.
 */
export default async function HomePage() {
  const [site, faculty] = await Promise.all([getSite(), getPeople("Faculty")]);

  const heroFacts = [
    { label: "Based at", value: "IIT Jodhpur" },
    { label: "Programme", value: "Medical Technologies" },
    { label: "Partner", value: "AIIMS Jodhpur" },
    { label: "Faculty", value: String(faculty.length) },
  ];

  return (
    <main id="main">
      <HomeAchievements />
      <Hero site={site} facts={heroFacts} />
      <VerticalsSection index="01" showPhoto />
      <HomeAbout index="02" />
      <HomeResearch index="03" />
      <ImpactSection index="04" />
      <section aria-label="From the gallery" className="section-y border-t border-line">
        <FromTheGallery />
      </section>
    </main>
  );
}
