import { PageHeader } from "@/components/layout/PageHeader";
import { PeopleSection } from "@/components/people/PeopleSection";
import { MoreLink } from "@/components/ui/MoreLink";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Faculty & Staff",
  "Leadership, affiliated faculty, visiting faculty and staff of the Medical Technology Centre, IIT Jodhpur × AIIMS Jodhpur.",
  "/people",
);

export default function PeoplePage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "People" }, { label: "Faculty & staff" }]}
        label="People"
        title="An interdisciplinary faculty."
        intro="Engineers, scientists, designers and public-health researchers affiliated with the Centre."
      >
        <MoreLink href="/students" className="mt-8">Students &amp; alumni</MoreLink>
      </PageHeader>
      <PeopleSection heading={false} />
    </main>
  );
}