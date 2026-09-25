import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { DigitalHealthContent } from "@/lib/types";
import { pad2 } from "@/lib/utils";

function Label({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-5 flex items-center gap-3">
      <span className="text-blue">{index}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-ink hover:text-blue">
      <span className="link-line">{children}</span>
      <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** Official Centre for Digital Health content, laid out editorially. */
export function DigitalHealthSections({ cdh }: { cdh: DigitalHealthContent }) {
  return (
    <>
      {/* About + vision */}
      <section aria-labelledby="cdh-about" className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Label index="01">About the Centre</Label>
            <h2 id="cdh-about" className="text-h2 text-ink">Health for all, through digital transformation.</h2>
          </Reveal>
          <div className="space-y-5 text-ink-2 lg:col-span-7 lg:col-start-6">
            {cdh.intro.map((p) => (
              <Reveal key={p}><p className="text-lead">{p}</p></Reveal>
            ))}
            <Reveal className="!mt-12 border-l-2 border-blue pl-6">
              <p className="eyebrow mb-3">Vision</p>
              <p className="text-[1.35rem] leading-snug tracking-[-0.015em] text-ink">{cdh.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="cdh-mission" className="section-y border-t border-line bg-paper">
        <div className="container-x">
          <Reveal>
            <Label index="02">Mission</Label>
            <h2 id="cdh-mission" className="text-h2 max-w-[18ch] text-ink">Six commitments.</h2>
          </Reveal>
          <ol className="mt-12 grid border-t border-ink md:grid-cols-2 md:gap-x-12">
            {cdh.mission.map((m, i) => (
              <Reveal as="li" key={m} delay={(i % 2) * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-6">
                <span className="font-mono text-xs text-blue">{pad2(i + 1)}</span>
                <span className="text-ink-2">{m}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Research areas */}
      <section aria-labelledby="cdh-research" className="section-y border-t border-line">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Label index="03">Research &amp; innovation</Label>
              <h2 id="cdh-research" className="text-h2 text-ink">Where the research goes.</h2>
              <p className="mt-6 max-w-sm text-muted">
                Ten areas that re-imagine healthcare technology in the digital domain.
              </p>
            </div>
          </Reveal>
          <ol className="border-t border-ink lg:col-span-8">
            {cdh.researchAreas.map((r, i) => (
              <Reveal as="li" key={r} delay={i * 0.03} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-line py-5">
                <span className="pt-1 font-mono text-xs text-muted">{pad2(i + 1)}</span>
                <span className="text-[1.15rem] leading-snug tracking-[-0.01em] text-ink">{r}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Capacity building */}
      <section aria-labelledby="cdh-programs" className="section-y border-t border-line bg-paper">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Label index="04">Capacity building</Label>
            <h2 id="cdh-programs" className="text-h2 text-ink">Programmes in Digital Health.</h2>
            <p className="mt-6 text-muted">{cdh.capacityBuilding.intro}</p>
            <p className="eyebrow mb-3 mt-10">Designed for</p>
            <ul className="space-y-2 text-[0.95rem] text-ink-2">
              {cdh.capacityBuilding.audiences.map((a) => (
                <li key={a} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-ink">
              {cdh.capacityBuilding.upcomingPrograms.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 0.05} className="flex items-baseline justify-between gap-4 border-b border-line py-6">
                  <span className="text-[1.25rem] leading-snug tracking-[-0.015em] text-ink">{p}</span>
                  <span className="shrink-0 rounded-xs border border-blue/30 bg-blue-soft px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-blue">
                    Upcoming
                  </span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Programmes are listed as upcoming on the official Centre for Digital Health page.
            </p>
          </div>
        </div>
      </section>

      {/* Open source + partnerships */}
      <section aria-labelledby="cdh-open" className="section-y border-t border-line">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <Label index="05">Open source</Label>
            <h2 id="cdh-open" className="text-h3 text-ink">Access to quality healthcare at low cost needs a community-based open-source platform.</h2>
            <p className="mt-5 text-ink-2">{cdh.openSource.goal}</p>
            <ul className="mt-8 border-t border-line">
              {cdh.openSource.activities.map((a) => (
                <li key={a} className="border-b border-line py-4 text-[0.95rem] text-ink-2">{a}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <Label index="06">Partnerships</Label>
            <h2 className="text-h3 text-ink">Working with the IIT Jodhpur innovation ecosystem.</h2>
            <ul className="mt-8 border-t border-line">
              {cdh.partners.map((p) => (
                <li key={p.name} className="border-b border-line py-5">
                  {p.url ? <External href={p.url}>{p.name}</External> : <p className="font-medium text-ink">{p.name}</p>}
                  <p className="mt-1.5 text-[0.93rem] text-muted">{p.description}</p>
                </li>
              ))}
              <li className="border-b border-line py-5">
                <p className="eyebrow mb-1.5">Knowledge partner</p>
                <p className="font-medium text-ink">{cdh.knowledgePartner.name}</p>
                <p className="mt-1.5 text-[0.93rem] text-muted">{cdh.knowledgePartner.description}</p>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="container-x mt-20">
          <p className="eyebrow mb-4">Aligned with</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5">
            {cdh.alignedWith.map((a) => (
              <li key={a} className="text-[0.93rem] text-ink-2">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="cdh-contact" className="border-t border-line bg-paper">
        <div className="container-x grid gap-8 py-16 lg:grid-cols-12 lg:items-end lg:py-20">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4">Contact</p>
            <h2 id="cdh-contact" className="text-h3 text-ink">{cdh.coordinator.name}</h2>
            <p className="mt-1 text-muted">{cdh.coordinator.role}</p>
          </div>
          <ul className="space-y-2 text-[0.95rem] lg:col-span-4">
            <li>
              <a href={`mailto:${cdh.coordinator.email}`} className="inline-flex items-center gap-2 text-ink hover:text-blue">
                <Mail aria-hidden className="size-4 text-muted" />
                <span className="link-line">{cdh.coordinator.email}</span>
              </a>
            </li>
            <li>
              <a href={`tel:+91${cdh.coordinator.phone.replace(/\D/g, "").replace(/^0/, "")}`} className="inline-flex items-center gap-2 text-ink hover:text-blue">
                <Phone aria-hidden className="size-4 text-muted" />
                <span className="link-line">{cdh.coordinator.phone}</span>
              </a>
            </li>
          </ul>
          <div className="lg:col-span-2 lg:text-right">
            <External href={cdh.officialUrl}>Official page</External>
          </div>
        </div>
      </section>
    </>
  );
}
