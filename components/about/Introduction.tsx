import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Program, SiteConfig } from "@/lib/types";

export function Introduction({ site, programs }: { site: SiteConfig; programs: Program[] }) {
  const meta = [
    { k: "Jointly offered by", v: "IIT Jodhpur & AIIMS Jodhpur" },
    { k: "Programmes", v: programs.map((p) => p.shortTitle).join(" · ") },
    { k: "Cohort model", v: "Equal seats for medical and engineering graduates" },
    { k: "Location", v: "Jodhpur, Rajasthan" },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-blue">01</span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span>The Center</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-10 hidden border-t border-line lg:block">
              {meta.map((m) => (
                <div key={m.k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-line py-4 text-sm">
                  <dt className="text-muted">{m.k}</dt>
                  <dd className="text-ink">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal>
            <h2 id="about-title" className="text-h2 max-w-[22ch] text-ink">
              Not a department. A place where clinical problems become{" "}
              <span className="text-blue">engineered technologies</span>.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 text-ink-2 md:grid-cols-2 md:gap-10">
            <Reveal delay={0.05}>
              <p>
                The post-graduate programmes in Medical Technologies, jointly offered by IIT Jodhpur
                and AIIMS Jodhpur, exist to foster innovation — and to build a pool of medical
                technologists who develop globally competitive medical and healthcare technologies for
                the challenges of today and the future.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                Medical science and engineering are taught side by side, with deliberate emphasis on
                translational R&amp;D, technology management and entrepreneurship. Coursework leads
                into a project that creates a futuristic device, process, product or protocol — and,
                for many, a start-up in healthcare.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-8 lg:hidden">
            <dl className="border-t border-line">
              {meta.map((m) => (
                <div key={m.k} className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-3.5 text-sm">
                  <dt className="text-muted">{m.k}</dt>
                  <dd className="text-ink">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <ImagePlaceholder
              ratio="21 / 9"
              figure="Fig. 02"
              brief="Mixed cohort of medical and engineering students with clinicians at AIIMS Jodhpur"
            />
          </Reveal>
          <p className="sr-only">Contact: {site.email}</p>
        </div>
      </div>
    </section>
  );
}
