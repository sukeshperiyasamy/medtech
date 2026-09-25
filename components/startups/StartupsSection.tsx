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
        <div className="mt-14 lg:mt-16">
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
