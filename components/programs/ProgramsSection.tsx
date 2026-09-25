import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPrograms } from "@/lib/data";
import { ProgramTabs } from "./ProgramTabs";

export async function ProgramsSection() {
  const programs = await getPrograms();
  return (
    <section id="programs" aria-labelledby="programs-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHeading
          id="programs-title"
          index="08"
          label="Programmes"
          title="Doctors and engineers, in the same classroom."
          intro="Jointly offered by IIT Jodhpur and AIIMS Jodhpur, with an equal number of seats for medical and engineering graduates."
        />
        <div className="mt-14 lg:mt-20">
          <ProgramTabs programs={programs} />
        </div>
      </div>
    </section>
  );
}
