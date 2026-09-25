import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { Program, SiteConfig } from "@/lib/types";

export function ClosingCta({ site, programs }: { site: SiteConfig; programs: Program[] }) {
  const admission = programs.find((p) => p.admission?.length)?.admission?.[0];
  return (
    <section aria-labelledby="closing-title" className="relative overflow-hidden border-t border-line bg-paper">
      <div aria-hidden className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_70%_50%,black,transparent_70%)]" />
      <div className="container-x relative grid gap-10 py-24 lg:grid-cols-12 lg:items-end lg:py-32">
        <Reveal className="lg:col-span-8">
          <p className="eyebrow mb-6">Start here</p>
          <h2 id="closing-title" className="text-display max-w-[16ch] text-ink">
            Every technology starts with a clinical question<span className="text-blue">.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
          <ButtonLink href="#collaborate">Collaborate with us</ButtonLink>
          {admission && (
            <ButtonLink href={admission.url} variant="secondary">
              Admissions
            </ButtonLink>
          )}
          <a href={`mailto:${site.email}`} className="link-line mt-2 text-sm text-muted">
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
