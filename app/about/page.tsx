import { PageHeader } from "@/components/layout/PageHeader";
import { Introduction } from "@/components/about/Introduction";
import { Partnership } from "@/components/about/Partnership";
import { PipelineSection } from "@/components/pipeline/PipelineSection";
import { getPrograms, getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "About",
  "The Medical Technologies Center brings IIT Jodhpur and AIIMS Jodhpur together to turn clinical needs into engineered, validated medical technologies.",
  "/about",
);

export default async function AboutPage() {
  const [site, programs] = await Promise.all([getSite(), getPrograms()]);
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "About" }]}
        label="About the Center"
        title="Where medicine sets the problem and engineering answers it."
        intro="A joint initiative of IIT Jodhpur and AIIMS Jodhpur — built around one translational model, from clinical need to real-world impact."
      />
      <Introduction site={site} programs={programs} index="01" />
      <Partnership site={site} index="02" />
      <PipelineSection index="03" />
    </main>
  );
}