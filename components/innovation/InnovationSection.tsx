import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { SampleNote } from "@/components/ui/SampleNote";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPeopleByIds, getProjectStages, getProjects, getResearchAreas } from "@/lib/data";
import { ProjectFeature } from "./ProjectFeature";

export async function InnovationSection({ index, heading = true }: SectionProps = {}) {
  const [projects, areas, stages] = await Promise.all([getProjects(), getResearchAreas(), getProjectStages()]);
  const rows = await Promise.all(
    projects.map(async (p) => ({
      project: p,
      areaTitle: areas.find((a) => a.id === p.researchAreaId)?.shortTitle ?? "",
      researchers: (await getPeopleByIds(p.researcherIds)).map((r) => r.name),
    })),
  );
  const hasSamples = projects.some((p) => p.provenance === "sample");

  return (
    <section id="innovation" aria-labelledby={heading ? "innovation-title" : undefined} className="section-y">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="innovation-title"
          index={index}
          label="Featured innovations"
          title="Technologies on their way to the clinic."
          intro="Each project is tracked from research to translation, with the clinical problem it answers stated first."
        />
        )}
        {hasSamples && (
          <SampleNote className="mt-10 max-w-3xl">
            The official website does not yet list Centre projects. These entries show how verified
            projects will be presented and must be replaced before launch.
          </SampleNote>
        )}
        {rows.length === 0 && (
          <div className="mt-14">
            <EmptyState title="Project profiles are being prepared." body="Verified Centre projects — with their clinical problem, technology and stage — will be published here." />
          </div>
        )}
        <div className="mt-14 space-y-16 lg:space-y-24">
          {rows.map((r, i) => (
            <ProjectFeature key={r.project.id} index={i} stages={stages} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
