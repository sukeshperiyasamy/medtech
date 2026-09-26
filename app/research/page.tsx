import { PageHeader } from "@/components/layout/PageHeader";
import { ResearchSection } from "@/components/research/ResearchSection";
import { InnovationSection } from "@/components/innovation/InnovationSection";
import { FundingCallout } from "@/components/home/FundingCallout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Research",
  "Research at the Medical Technology Centre: sensors and diagnostics, imaging and AI, rehabilitation robotics, nanomedicine, device design and digital health.",
  "/research",
);

export default function ResearchPage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Research" }]}
        label="Research"
        title="Research that starts at the bedside."
        intro="Six themes drawn from the published expertise of the Centre's affiliated faculty, and the projects moving from lab to clinic."
      />
      <ResearchSection heading={false} />
      <div className="border-t border-line">
        <InnovationSection />
      </div>
      <FundingCallout />
    </main>
  );
}