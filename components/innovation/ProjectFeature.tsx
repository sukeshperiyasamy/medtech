"use client";

import Image from "next/image";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SampleBadge } from "@/components/ui/SampleNote";
import type { Project, ProjectStage } from "@/lib/types";
import { cn, pad2 } from "@/lib/utils";
import { StageTracker } from "./StageTracker";

interface Props {
  project: Project;
  index: number;
  areaTitle: string;
  researchers: string[];
  stages: ProjectStage[];
}

export function ProjectFeature({ project, index, areaTitle, researchers, stages }: Props) {
  const flip = index % 2 === 1;
  return (
    <MotionProvider>
      <article className="grid items-center gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12 lg:pt-14">
        <m.div
          className={cn("lg:col-span-7", flip && "lg:order-2")}
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          whileInView={{ clipPath: "inset(0 0 0 0%)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        >
          {project.image ? (
            <div className="group overflow-hidden">
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={1200}
                height={750}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-precise)] group-hover:scale-[1.03]"
              />
            </div>
          ) : (
            <ImagePlaceholder
              ratio="16 / 10"
              figure={`Project ${pad2(index + 1)}`}
              brief={`Prototype or device photograph — ${project.title.toLowerCase()}`}
            />
          )}
        </m.div>

        <m.div
          className={cn("lg:col-span-5", flip && "lg:order-1")}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-blue">{pad2(index + 1)}</span>
            <span className="eyebrow">{areaTitle}</span>
            {project.provenance === "sample" && <SampleBadge />}
          </div>
          <h3 className="text-h3 mt-4 text-ink">{project.title}</h3>

          <dl className="mt-8 space-y-5 text-[0.97rem]">
            <div>
              <dt className="eyebrow mb-1.5">Clinical problem</dt>
              <dd className="text-ink-2">{project.clinicalProblem}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1.5">Technology</dt>
              <dd className="text-ink-2">{project.technology}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1.5">Researchers</dt>
              <dd className="text-ink-2">{researchers.length ? researchers.join(", ") : "To be confirmed"}</dd>
            </div>
          </dl>

          <div className="mt-9">
            <p className="eyebrow mb-3">Stage</p>
            <StageTracker stages={stages} current={project.stage} />
          </div>
        </m.div>
      </article>
    </MotionProvider>
  );
}
