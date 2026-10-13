import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { SampleNote } from "@/components/ui/SampleNote";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPeopleByIds, getResearchAreas, getSite, getStartups, getTrlScale } from "@/lib/data";
import { StartupShowcase, type ResolvedStartup } from "./StartupShowcase";

export async function StartupsSection({ index, heading = true }: SectionProps = {}) {
  const [startups, areas, scale, site] = await Promise.all([
    getStartups(),
    getResearchAreas(),
    getTrlScale(),
    getSite(),
  ]);
  const resolved: ResolvedStartup[] = await Promise.all(
    startups.map(async (s) => ({
      ...s,
      areaTitle: areas.find((a) => a.id === s.researchAreaId)?.shortTitle,
      mentors: (await getPeopleByIds(s.mentorIds)).map(({ id, name, designation }) => ({ id, name, designation })),
    })),
  );
  const hasSamples = startups.some((s) => s.provenance === "sample");

  return (
    <section id="startups" aria-labelledby={heading ? "startups-title" : undefined} className="section-y border-t border-line bg-paper">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="startups-title"
          index={index}
          label="Student & Faculty Ventures"
          title="From classroom to company."
          intro="Ventures founded by the Centre's students and faculty — their products, how ready the technology is, the teams behind them and the funding they have won."
        />
        )}
        {hasSamples && (
          <SampleNote className="mt-10 max-w-3xl">
            Startup profiles are awaiting verified details from the founders. The entries below show
            the layout; names, products, TRL and funding must be replaced before launch.
          </SampleNote>
        )}
        {/* Master Sheet Incubation Ecosystem Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-line bg-white p-4 shadow-xs">
            <p className="font-mono text-[0.72rem] uppercase tracking-wider text-muted">Total Ventures</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">10</p>
            <p className="mt-0.5 text-xs text-muted">Deep-tech healthcare companies</p>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-xs">
            <p className="font-mono text-[0.72rem] uppercase tracking-wider text-emerald-800">Incubated Startups</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-700 sm:text-3xl">7</p>
            <p className="mt-0.5 text-xs text-emerald-700/80">TISC signed incubation agreements</p>
          </div>
          <div className="rounded-xl border border-purple-200/80 bg-purple-50/40 p-4 shadow-xs">
            <p className="font-mono text-[0.72rem] uppercase tracking-wider text-purple-800">Pre-Incubatees</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-purple-700 sm:text-3xl">3</p>
            <p className="mt-0.5 text-xs text-purple-700/80">Pipeline translation ventures</p>
          </div>
          <div className="rounded-xl border border-teal-200/80 bg-teal-50/40 p-4 shadow-xs">
            <p className="font-mono text-[0.72rem] uppercase tracking-wider text-teal-800">Patent-Backed</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-teal-700 sm:text-3xl">6</p>
            <p className="mt-0.5 text-xs text-teal-700/80">Ventures with filed IPR</p>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          {resolved.length ? (
            <StartupShowcase startups={resolved} scale={scale} email={site.email} />
          ) : (
            <EmptyState
              title="Venture profiles are being verified."
              body="Student and faculty ventures will be listed here once their details — product, TRL, team and funding — are confirmed with the founders."
              email={site.email}
              subject="Startup listing"
            />
          )}
        </div>
        <p className="mt-8 text-sm text-muted lg:hidden">
          Student founder?{" "}
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("Startup listing")}`} className="link-line text-blue">
            Submit your startup
          </a>
        </p>
      </div>
    </section>
  );
}
