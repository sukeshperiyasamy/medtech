import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPipeline } from "@/lib/data";
import { PipelineStory } from "./PipelineStory";

export async function PipelineSection() {
  const stages = await getPipeline();
  return (
    <section id="pipeline" aria-labelledby="pipeline-title" className="border-y border-line bg-white pt-24 lg:pt-36">
      <div className="container-x">
        <SectionHeading
          id="pipeline-title"
          index="04"
          label="Clinical need → Impact"
          title={
            <>
              From a patient&rsquo;s problem
              <br className="hidden sm:block" /> to a working technology.
            </>
          }
          intro="The Center's translational model in nine stages. Scroll to move through it — each stage names the question being answered, and who answers it."
        />
      </div>
      <div className="mt-16 pb-24 lg:mt-8 lg:pb-16">
        <PipelineStory stages={stages} />
      </div>
    </section>
  );
}
