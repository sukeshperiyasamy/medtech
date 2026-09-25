import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { Hero } from "@/components/hero/Hero";
import { Introduction } from "@/components/about/Introduction";
import { Partnership } from "@/components/about/Partnership";
import { ResearchSection } from "@/components/research/ResearchSection";
import { PipelineSection } from "@/components/pipeline/PipelineSection";
import { InnovationSection } from "@/components/innovation/InnovationSection";
import { FundingSection } from "@/components/funding/FundingSection";
import { ImpactSection } from "@/components/impact/ImpactSection";
import { ProgramsSection } from "@/components/programs/ProgramsSection";
import { PeopleSection } from "@/components/people/PeopleSection";
import { CollaborationSection } from "@/components/collaboration/CollaborationSection";
import { NewsSection } from "@/components/news/NewsSection";
import { ClosingCta } from "@/components/footer/ClosingCta";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { getPeople, getPrograms, getSite } from "@/lib/data";

export default async function HomePage() {
  const [site, programs, faculty] = await Promise.all([getSite(), getPrograms(), getPeople("Faculty")]);

  const heroFacts = [
    { label: "Jointly offered", value: "IIT Jodhpur & AIIMS Jodhpur" },
    { label: "Cohort model", value: "Equal seats — medical & engineering" },
    { label: "Programmes", value: programs.map((p) => p.shortTitle).join(" · ") },
    { label: "Affiliated faculty", value: `${faculty.length} at IIT Jodhpur` },
  ];

  return (
    <>
      <AnnouncementBar announcement={site.announcement} />
      <SiteHeader site={site} />
      <main id="main">
        <Hero site={site} facts={heroFacts} />
        <Introduction site={site} programs={programs} />
        <Partnership site={site} />
        <ResearchSection />
        <PipelineSection />
        <InnovationSection />
        <FundingSection />
        <ImpactSection />
        <ProgramsSection />
        <PeopleSection />
        <CollaborationSection />
        <NewsSection />
        <ClosingCta site={site} programs={programs} />
      </main>
      <SiteFooter site={site} />
    </>
  );
}
