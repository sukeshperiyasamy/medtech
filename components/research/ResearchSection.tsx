import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { getPeopleByIds, getResearchAreas } from "@/lib/data";
import { ResearchExplorer, type ResolvedArea } from "./ResearchExplorer";

export async function ResearchSection({ index, heading = true }: SectionProps = {}) {
  const areas = await getResearchAreas();
  const resolved: ResolvedArea[] = await Promise.all(
    areas.map(async (a) => ({
      ...a,
      faculty: (await getPeopleByIds(a.facultyIds)).map(({ id, name, designation, photo }) => ({
        id,
        name,
        designation,
        photo,
      })),
    })),
  );

  return (
    <section id="research" aria-labelledby={heading ? "research-title" : undefined} className="section-y">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="research-title"
          index={index}
          label="Research"
          title="Research that starts at the bedside."
          intro="Six themes, drawn from the published expertise of the Centre's affiliated faculty — spanning sensing, imaging, robotics, materials, design and health systems."
        />
        )}
        <div className="mt-14 lg:mt-20">
          <ResearchExplorer areas={resolved} />
        </div>
        <p className="mt-8 max-w-2xl text-sm text-muted">
          Themes are grouped from the research interests listed on the official IIT Jodhpur People
          page. Clinical collaborators from AIIMS Jodhpur will be added as the directory is extended.
        </p>
      </div>
    </section>
  );
}
