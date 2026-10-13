import { FundingHero } from "@/components/funding/FundingHero";
import { FundingMetricsBar } from "@/components/funding/FundingMetricsBar";
import { FundingSection } from "@/components/funding/FundingSection";
import { getGrants } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Funding & Grants",
  "Verified grants, translational seed capital, and competitive biomedical schemes supporting research and startup incubation at IIT Jodhpur and AIIMS Jodhpur.",
  "/funding",
);

export default async function FundingPage() {
  const grants = await getGrants();

  return (
    <main id="main">
      {/* Editorial Hero */}
      <FundingHero />

      {/* Compact Metrics Bar */}
      <FundingMetricsBar grants={grants} />

      {/* Page Content Sections */}
      <FundingSection />
    </main>
  );
}