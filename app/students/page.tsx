import { PageHeader } from "@/components/layout/PageHeader";
import { StudentsSection } from "@/components/students/StudentsSection";
import { getStudents } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Students & Alumni",
  "Every cohort of the Master's, PhD and Dual Degree programmes in Medical Technologies since 2020, as published by IIT Jodhpur.",
  "/students",
);

export default async function StudentsPage() {
  const students = await getStudents();
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "People", href: "/people" }, { label: "Students & alumni" }]}
        label="Students & alumni"
        title="The people the programme was built for."
        intro={`${students.length} medical and engineering graduates admitted since ${Math.min(...students.map((s) => s.cohortYear))}, listed by cohort as published by IIT Jodhpur.`}
      />
      <StudentsSection heading={false} />
    </main>
  );
}