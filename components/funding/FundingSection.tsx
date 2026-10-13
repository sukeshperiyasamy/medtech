import { getGrants, getSite } from "@/lib/data";
import { FeaturedFunding } from "./FeaturedFunding";
import { ResearchToImpactPathway } from "./ResearchToImpactPathway";
import { FundingExplorer } from "./FundingExplorer";
import { NationalOpportunitiesSection } from "./NationalOpportunitiesSection";
import { FundingCTA } from "./FundingCTA";

export async function FundingSection() {
  const [grants, site] = await Promise.all([getGrants(), getSite()]);

  return (
    <div className="bg-white">
      {/* 01: Featured Secured Funding (Editorial layout) */}
      <FeaturedFunding grants={grants} />

      {/* 02: Research-to-Impact Connection (Restrained progression) */}
      <ResearchToImpactPathway />

      {/* 03: Complete Funding Directory & Interactive Explorer */}
      <section className="section-y border-b border-line bg-white">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">03 — Searchable Directory</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Funding explorer & verified records.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Search by grant scheme, awarding ministry, recipient scholar, mentor, venture, or patent application number.
            </p>
          </div>

          <FundingExplorer grants={grants} />
        </div>
      </section>

      {/* 04: Open National Schemes (Clearly distinct from secured awards) */}
      <NationalOpportunitiesSection grants={grants} contactEmail={site.email} />

      {/* 05: Final Editorial CTA */}
      <FundingCTA contactEmail={site.email} />
    </div>
  );
}
