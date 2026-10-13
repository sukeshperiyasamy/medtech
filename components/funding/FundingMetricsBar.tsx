import type { Grant } from "@/lib/types";

export function FundingMetricsBar({ grants }: { grants: Grant[] }) {
  // 1. Unique confirmed secured awards (grantStatus === "Awarded")
  const securedAwards = grants.filter((g) => g.grantStatus === "Awarded");
  const uniqueSecuredCount = securedAwards.length;

  // 2. Government & mission sponsored awards
  const govtAwardsCount = securedAwards.filter((g) =>
    g.categories.includes("Government"),
  ).length;

  // 3. Ongoing national & institutional application pathways
  const openCallCount = grants.filter((g) => g.grantStatus !== "Awarded").length;

  return (
    <div className="border-b border-line bg-paper/60">
      <div className="container-x py-6 lg:py-8">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {/* Metric 1: Verified Secured Awards */}
          <div className="pr-4 sm:px-6 first:pl-0">
            <span className="eyebrow block text-[0.68rem]">Confirmed Records</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                {uniqueSecuredCount}
              </span>
              <span className="font-mono text-xs text-emerald-700 font-medium">Secured</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              Unique grants, fellowships & seed awards won by Centre innovators
            </p>
          </div>

          {/* Metric 2: Seed Capital Raised */}
          <div className="px-4 sm:px-6">
            <span className="eyebrow block text-[0.68rem]">Venture Seed Capital</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                $100K
              </span>
              <span className="font-mono text-xs text-muted">USD</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              Raised for SWASAM / Caldor Health electromechanical tissue remodeling
            </p>
          </div>

          {/* Metric 3: Government & Mission Grants */}
          <div className="pr-4 sm:px-6">
            <span className="eyebrow block text-[0.68rem]">Government R&D</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                {govtAwardsCount}
              </span>
              <span className="font-mono text-xs text-blue font-medium">Schemes</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              BIRAC BIG, ANRF Maha MedTech, MSME 4.0 & PMRF doctoral support
            </p>
          </div>

          {/* Metric 4: Open Call Pathways */}
          <div className="px-4 sm:px-6 last:pr-0">
            <span className="eyebrow block text-[0.68rem]">National Pathways</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                {openCallCount}
              </span>
              <span className="font-mono text-xs text-teal-ink font-medium">Active</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              Ongoing national application channels across ICMR, DBT & Industry R&D
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
