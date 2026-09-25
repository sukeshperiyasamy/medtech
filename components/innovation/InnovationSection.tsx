import { SectionHeading } from "@/components/ui/SectionHeading";
import { SampleNote } from "@/components/ui/SampleNote";
import { getPeopleByIds, getProjectStages, getProjects, getResearchAreas } from "@/lib/data";
import { ProjectFeature } from "./ProjectFeature";

export async function InnovationSection() {
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
    <section id="innovation" aria-labelledby="innovation-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="innovation-title"
          index="05"
          label="Featured innovations"
          title="Technologies on their way to the clinic."
          intro="Each project is tracked from research to translation, with the clinical problem it answers stated first."
        />
        {hasSamples && (
          <SampleNote className="mt-10 max-w-3xl">
            The official website does not yet list Center projects. These entries show how verified
            projects will be presented and must be replaced before launch.
          </SampleNote>
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
