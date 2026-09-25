import { PageHeader } from "@/components/layout/PageHeader";
import { StartupsSection } from "@/components/startups/StartupsSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Student & Faculty Ventures",
  "Startups founded by students and faculty of the Medical Technology Centre — products, technology readiness, teams and funding.",
  "/startups",
);

export default function StartupsPage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Startups" }]}
        label="Student & Faculty Ventures"
        title="From classroom to company."
        intro="Ventures founded by the Centre's students and faculty — what they build, how ready it is, who is behind it and how it is funded."
      />
      <StartupsSection heading={false} />
    </main>
  );
}