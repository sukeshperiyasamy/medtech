import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { CollaborationPathway, Program, SiteConfig } from "@/lib/types";

/** Closing collaboration band: one statement, the audiences, and two actions. */
export function ClosingCta({
  site,
  programs,
  pathways,
}: {
  site: SiteConfig;
  programs: Program[];
  pathways: CollaborationPathway[];
}) {
  const admission = programs.find((p) => p.admission?.length)?.admission?.[0];
  return (
    <section aria-labelledby="closing-title" className="relative overflow-hidden border-t border-line bg-paper">
      <div aria-hidden className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
      <div className="container-x relative py-24 lg:py-32">
        <Reveal>
          <p className="eyebrow mb-6">Collaborate</p>
          <h2 id="closing-title" className="text-display max-w-[16ch] text-ink">
            Build the future of healthcare with us<span className="text-blue">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:items-end">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 lg:col-span-8">
            {pathways.map((p) => (
              <li key={p.id}>
                <a href={p.cta.url} className="group block">
                  <span className="eyebrow block">{p.audience}</span>
                  <span className="mt-1 block text-[1.05rem] text-ink transition-colors group-hover:text-blue">{p.title}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <ButtonLink href="/contact">Contact the Centre</ButtonLink>
            {admission && (
              <ButtonLink href={admission.url} variant="secondary">
                Admissions
              </ButtonLink>
            )}
          </div>
        </Reveal>
        <p className="mt-8 text-sm text-muted">
          Or write to{" "}
          <a href={`mailto:${site.email}`} className="link-line text-ink-2">
            {site.email}
          </a>
        </p>
      </div>
    </section>
  );
}
