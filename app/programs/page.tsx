import { PageHeader } from "@/components/layout/PageHeader";
import { ProgramsSection } from "@/components/programs/ProgramsSection";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { courseLd } from "@/lib/structured-data";
import { getPrograms } from "@/lib/data";

export const metadata = pageMetadata(
  "Programmes",
  "Master's and PhD programmes in Medical Technologies, jointly offered by IIT Jodhpur and AIIMS Jodhpur.",
  "/programs",
);

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <main id="main">
      <JsonLd data={programs.map(courseLd)} />
      <PageHeader
        crumbs={[
          { label: "Medical Technologies Program", href: "/medical-technologies" },
          { label: "Programmes" },
        ]}
        label="Programmes"
        title="Doctors and engineers, in the same classroom."
        intro="Jointly offered by IIT Jodhpur and AIIMS Jodhpur, with an equal number of seats for medical and engineering graduates."
      />
      <ProgramsSection heading={false} />
    </main>
  );
}
