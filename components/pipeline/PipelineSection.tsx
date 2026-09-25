import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { getPipeline } from "@/lib/data";
import { PipelineStory } from "./PipelineStory";

export async function PipelineSection({ index, heading = true }: SectionProps = {}) {
  const stages = await getPipeline();
  return (
    <section
      id="pipeline"
      aria-labelledby={heading ? "pipeline-title" : undefined}
      className="border-y border-line bg-white pt-24 lg:pt-36"
    >
      {heading && (
        <div className="container-x">
          <SectionHeading
            id="pipeline-title"
            index={index}
            label="Clinical need → Impact"
            title={
              <>
                From a patient&rsquo;s problem
                <br className="hidden sm:block" /> to a working technology.
              </>
            }
            intro="The programme's translational model in nine stages. Scroll to move through it — each stage names the question being answered, and who answers it."
          />
        </div>
      )}
      <div className="mt-16 pb-24 lg:mt-8 lg:pb-16">
        <PipelineStory stages={stages} />
      </div>
    </section>
  );
}
