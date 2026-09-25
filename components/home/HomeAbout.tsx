import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { getPipeline, getSite } from "@/lib/data";
import { PipelineStrip } from "./PipelineStrip";

const IITJ = "Engineering · Technology · AI · Systems";
const AIIMS = "Clinical expertise · Medical needs · Validation";

export async function HomeAbout({ index }: { index?: string }) {
  const [site, stages] = await Promise.all([getSite(), getPipeline()]);
  const [iitj, aiims] = site.institutions;

  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x">
        {/* Statement */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-5 flex items-center gap-3">
              {index && <span className="text-blue">{index}</span>}
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span>About the Center</span>
            </p>
            <h2 id="about-title" className="text-h2 max-w-[20ch] text-ink">
              Not a department. A place where clinical problems become{" "}
              <span className="text-blue">engineered technologies</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:pt-14">
            <p className="text-lead text-ink-2">
              Jointly run by IIT Jodhpur and AIIMS Jodhpur, the Center brings medical and engineering
              graduates into the same classroom — with equal seats for each — to build globally
              competitive medical technologies.
            </p>
            <Link href="/about" className="group mt-6 inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink hover:text-blue">
              <span className="link-line">About the Center</span>
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Institutional lockup: IITJ → Center ← AIIMS */}
        <Reveal className="mt-16 lg:mt-24">
          <div className="grid border-y border-line md:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-4 py-6 md:pr-8">
              <Image src={iitj.logo.src} alt={iitj.logo.alt} width={48} height={53} className="h-12 w-auto" />
              <div>
                <p className="text-lg font-medium tracking-[-0.01em] text-ink">IIT Jodhpur</p>
                <p className="text-sm text-muted">{IITJ}</p>
              </div>
            </div>
            <div className="flex items-center justify-center border-y border-line py-6 md:border-x md:border-y-0 md:px-10">
              <div className="text-center">
                <span aria-hidden className="mx-auto mb-3 block h-[3px] w-10 bg-blue" />
                <p className="text-[1.05rem] font-medium tracking-[-0.01em] text-ink">Medical Technologies Center</p>
                <p className="eyebrow mt-1">Joint programmes · Translational R&amp;D</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 md:flex-row-reverse md:pl-8 md:text-right">
              <Image src={aiims.logo.src} alt={aiims.logo.alt} width={48} height={48} className="h-12 w-auto" />
              <div>
                <p className="text-lg font-medium tracking-[-0.01em] text-ink">AIIMS Jodhpur</p>
                <p className="text-sm text-muted">{AIIMS}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* How we work */}
        <div className="mt-16 lg:mt-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">How we work</p>
              <p className="mt-2 text-h3 text-ink">Clinical need → engineering → validation → translation.</p>
            </div>
            <Link href="/about#pipeline" className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink hover:text-blue">
              <span className="link-line">The full model</span>
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <PipelineStrip stages={stages} />
        </div>
      </div>
    </section>
  );
}
