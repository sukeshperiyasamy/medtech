import type { Startup } from "@/lib/types";

export function StartupsMetricsBar({ startups }: { startups: Startup[] }) {
  const totalVentures = startups.length;
  const incubatedCount = startups.filter((s) => s.incubationStage === "Incubated").length;
  const preIncubatedCount = startups.filter((s) => s.incubationStage === "Pre-Incubatee").length;

  const patentVentures = startups.filter(
    (s) => s.associatedPatents && s.associatedPatents.length > 0,
  );
  const patentVenturesCount = patentVentures.length;

  // Total patent application filings across startups
  const totalFilings = startups.reduce(
    (acc, s) => acc + (s.associatedPatents ? s.associatedPatents.length : 0),
    0,
  );

  return (
    <div className="border-b border-line bg-paper/60">
      <div className="container-x py-6 lg:py-8">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-line">
          {/* Metric 1: Total Verified Ventures */}
          <div className="pr-4 sm:px-6 first:pl-0">
            <span className="eyebrow block text-[0.68rem]">Documented Ventures</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                {totalVentures}
              </span>
              <span className="font-mono text-xs text-blue font-medium">Companies</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              {incubatedCount} TISC incubated · {preIncubatedCount} pre-incubatees
            </p>
          </div>

          {/* Metric 2: Patent-Backed Innovations */}
          <div className="px-4 sm:px-6">
            <span className="eyebrow block text-[0.68rem]">Intellectual Property</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                {patentVenturesCount}
              </span>
              <span className="font-mono text-xs text-teal-ink font-medium">Ventures</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              {totalFilings} patent applications filed with Indian Patent Office
            </p>
          </div>

          {/* Metric 3: Confirmed External Capital */}
          <div className="pr-4 sm:px-6">
            <span className="eyebrow block text-[0.68rem]">Confirmed Venture Capital</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
                $100K
              </span>
              <span className="font-mono text-xs text-emerald-700 font-medium">+ ₹30L</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              SWASAM seed round &amp; MSME 4.0 prototype grants
            </p>
          </div>

          {/* Metric 4: Clinical Partnership */}
          <div className="px-4 sm:px-6">
            <span className="eyebrow block text-[0.68rem]">Hospital Immersion</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-ink lg:text-3xl">
                AIIMS
              </span>
              <span className="font-mono text-xs text-purple-700 font-medium">Jodhpur</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-tight">
              Joint clinical mentorship, simulation protocols &amp; phantom trials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
