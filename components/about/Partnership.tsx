"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { SiteConfig } from "@/lib/types";

const IITJ = ["Engineering", "Technology", "AI & data", "Systems"];
const AIIMS = ["Clinical expertise", "Medical needs", "Validation"];
const OUT = ["Joint programmes", "Translational R&D", "Entrepreneurship"];

const ease = [0.65, 0, 0.35, 1] as const;
const draw = (delay: number) => ({
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true, margin: "-20% 0px" },
  transition: { duration: 1.1, delay, ease },
});

/** Signature diagram: two institutions converge on the joint Medical Technologies Program. */
function DesktopDiagram({ site }: { site: SiteConfig }) {
  const [iitj, aiims] = site.institutions;
  const cy = 250;
  const leftY = IITJ.map((_, i) => 175 + i * 50);
  const rightY = AIIMS.map((_, i) => 200 + i * 50);
  const outX = [390, 600, 810];

  return (
    <svg viewBox="0 0 1200 560" className="h-auto w-full" role="img" aria-labelledby="partner-svg-title">
      <title id="partner-svg-title">
        IIT Jodhpur contributes engineering, technology, AI and systems; AIIMS Jodhpur contributes
        clinical expertise, medical needs and validation. Both converge on the Medical Technologies
        Program, which produces joint programmes, translational R&amp;D and entrepreneurship.
      </title>

      {/* Institutions */}
      <image href={iitj.logo.src} x={40} y={30} width={62} height={68} />
      <text x={40} y={128} fontSize={22} fill="#111827" fontWeight={500} letterSpacing="-0.01em">IIT Jodhpur</text>
      <image href={aiims.logo.src} x={1098} y={34} width={62} height={62} />
      <text x={1160} y={128} fontSize={22} fill="#111827" fontWeight={500} textAnchor="end" letterSpacing="-0.01em">AIIMS Jodhpur</text>

      <g className="font-mono" fontSize={11} letterSpacing="0.08em" fill="#64748b">
        <text x={40} y={150}>ENGINEERING &amp; TECHNOLOGY</text>
        <text x={1160} y={150} textAnchor="end">CLINICAL MEDICINE</text>
      </g>

      {/* Capabilities */}
      {IITJ.map((label, i) => (
        <g key={label}>
          <text x={40} y={leftY[i] + 5} fontSize={16} fill="#334155">{label}</text>
          <motion.path
            d={`M 290 ${leftY[i]} C 400 ${leftY[i]}, 400 ${cy}, 480 ${cy}`}
            fill="none" stroke="#2563eb" strokeWidth={1.2} {...draw(0.1 + i * 0.08)}
          />
          <circle cx={290} cy={leftY[i]} r={3.5} fill="#fff" stroke="#2563eb" strokeWidth={1.2} />
          <line x1={40 + label.length * 8.6 + 10} x2={282} y1={leftY[i]} y2={leftY[i]} stroke="#e2e8f0" />
        </g>
      ))}
      {AIIMS.map((label, i) => (
        <g key={label}>
          <text x={1160} y={rightY[i] + 5} fontSize={16} fill="#334155" textAnchor="end">{label}</text>
          <motion.path
            d={`M 910 ${rightY[i]} C 800 ${rightY[i]}, 800 ${cy}, 720 ${cy}`}
            fill="none" stroke="#14b8a6" strokeWidth={1.2} {...draw(0.1 + i * 0.08)}
          />
          <circle cx={910} cy={rightY[i]} r={3.5} fill="#fff" stroke="#14b8a6" strokeWidth={1.2} />
          <line x1={918} x2={1160 - label.length * 8.6 - 10} y1={rightY[i]} y2={rightY[i]} stroke="#e2e8f0" />
        </g>
      ))}

      {/* Program node */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <rect x={480} y={cy - 54} width={240} height={108} fill="#fff" stroke="#111827" strokeWidth={1.2} />
        <rect x={480} y={cy - 54} width={240} height={4} fill="#2563eb" />
        <text x={600} y={cy - 8} textAnchor="middle" fontSize={19} fill="#111827" fontWeight={500} letterSpacing="-0.01em">Medical Technologies</text>
        <text x={600} y={cy + 16} textAnchor="middle" fontSize={19} fill="#111827" fontWeight={500} letterSpacing="-0.01em">Program</text>
        <text x={600} y={cy + 40} textAnchor="middle" className="font-mono" fontSize={10} letterSpacing="0.08em" fill="#64748b">IITJ × AIIMS</text>
      </motion.g>

      {/* Outputs */}
      <motion.path d={`M 600 ${cy + 54} L 600 ${cy + 120}`} fill="none" stroke="#111827" strokeWidth={1.2} {...draw(1.2)} />
      <motion.path d={`M ${outX[0]} ${cy + 150} L ${outX[0]} ${cy + 120} L ${outX[2]} ${cy + 120} L ${outX[2]} ${cy + 150}`} fill="none" stroke="#111827" strokeWidth={1.2} {...draw(1.4)} />
      <motion.path d={`M 600 ${cy + 120} L 600 ${cy + 150}`} fill="none" stroke="#111827" strokeWidth={1.2} {...draw(1.5)} />
      {OUT.map((label, i) => (
        <motion.g
          key={label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ delay: 1.8 + i * 0.1, duration: 0.6 }}
        >
          <circle cx={outX[i]} cy={cy + 156} r={5} fill="#2563eb" />
          <text x={outX[i]} y={cy + 190} textAnchor="middle" fontSize={17} fill="#111827">{label}</text>
          <text x={outX[i]} y={cy + 212} textAnchor="middle" className="font-mono" fontSize={10} letterSpacing="0.08em" fill="#94a3b8">
            {`OUTPUT 0${i + 1}`}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

type Inst = SiteConfig["institutions"][number];

function InstitutionBlock({ inst, items, color }: { inst: Inst; items: string[]; color: string }) {
  return (
    <div className="border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <Image src={inst.logo.src} alt={inst.logo.alt} width={40} height={40} className="h-10 w-auto" style={{ width: "auto", height: "auto" }} />
        <p className="text-lg font-medium text-ink">{inst.name}</p>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem] text-ink-2">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: color }} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Connector({ color }: { color: string }) {
  return (
    <div aria-hidden className="flex justify-center py-1">
      <motion.span
        className="block h-10 w-px origin-top"
        style={{ background: color }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
}

function MobileDiagram({ site }: { site: SiteConfig }) {
  const [iitj, aiims] = site.institutions;
  const Block = InstitutionBlock;
  return (
    <div className="relative">
      <Block inst={iitj} items={IITJ} color="#2563eb" />
      <Connector color="#2563eb" />
      <div className="border border-ink bg-white px-5 py-6 text-center">
        <span aria-hidden className="mx-auto mb-4 block h-1 w-12 bg-blue" />
        <p className="text-xl font-medium tracking-[-0.01em] text-ink">Medical Technologies Program</p>
        <p className="eyebrow mt-2">{OUT.join(" · ")}</p>
      </div>
      <Connector color="#14b8a6" />
      <Block inst={aiims} items={AIIMS} color="#14b8a6" />
    </div>
  );
}

export function Partnership({ site, index }: { site: SiteConfig; index?: string }) {
  const points = [
    { t: "IIT Jodhpur", d: "Engineering depth — sensors, electronics, robotics, materials, AI and systems — and the labs to build with it." },
    { t: "AIIMS Jodhpur", d: "Clinical expertise, first-hand medical needs, and the clinical setting in which technologies are tested and validated." },
    { t: "Together", d: "Joint coursework, mixed cohorts and shared projects, so every technology starts from a real clinical question." },
  ];
  return (
    <section id="partnership" aria-labelledby="partnership-title" className="section-y bg-paper">
      <div className="container-x">
        <SectionHeading
          id="partnership-title"
          index={index}
          label="IIT Jodhpur × AIIMS Jodhpur"
          title={<>Two institutions. One translational loop.</>}
          intro="An engineering institute and a medical institute, designing the curriculum and the research together — so that medicine sets the problem and engineering answers it."
        />
        <div className="mt-16 lg:mt-20">
          <div className="hidden border border-line bg-white px-6 py-8 md:block lg:px-10 lg:py-10">
            <DesktopDiagram site={site} />
          </div>
          <div className="md:hidden">
            <MobileDiagram site={site} />
          </div>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08} className="border-t border-ink pt-5">
              <p className="eyebrow mb-3">{`0${i + 1}`}</p>
              <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{p.t}</h3>
              <p className="mt-3 text-[0.98rem] text-muted">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
