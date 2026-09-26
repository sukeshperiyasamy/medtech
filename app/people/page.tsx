import { PageHeader } from "@/components/layout/PageHeader";
import { PeopleSection } from "@/components/people/PeopleSection";
import { MoreLink } from "@/components/ui/MoreLink";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { peopleLd } from "@/lib/structured-data";
import { getPeople, getSite } from "@/lib/data";

export const metadata = pageMetadata(
  "Faculty & Staff",
  "Leadership, affiliated faculty, visiting faculty and staff of the Medical Technology Centre, IIT Jodhpur × AIIMS Jodhpur.",
  "/people",
);

export default async function PeoplePage() {
  const [people, site] = await Promise.all([getPeople(), getSite()]);
  return (
    <main id="main">
      <JsonLd
        data={peopleLd(
          people.filter((p) => p.category !== "Students"),
          site,
        )}
      />
      <PageHeader
        crumbs={[{ label: "People" }, { label: "Faculty & staff" }]}
        label="People"
        title="An interdisciplinary faculty."
        intro="Engineers, scientists, designers and public-health researchers affiliated with the Centre."
      >
        <MoreLink href="/students" className="mt-8">
          Students &amp; alumni
        </MoreLink>
      </PageHeader>
      <PeopleSection heading={false} />
    </main>
  );
}
