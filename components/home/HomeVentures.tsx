import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { SampleBadge } from "@/components/ui/SampleNote";
import { TrlMeter } from "@/components/startups/TrlMeter";
import { getSite, getStartups, getTrlScale } from "@/lib/data";

export async function HomeVentures({ index }: { index?: string }) {
  const [ventures, scale, site] = await Promise.all([getStartups(), getTrlScale(), getSite()]);
  const featured = ventures.slice(0, 3);

  return (
    <section id="ventures" aria-labelledby="home-ventures-title" className="section-y border-t border-line bg-paper">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-5 flex items-center gap-3">
            {index && <span className="text-blue">{index}</span>}
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>Student &amp; Faculty Ventures</span>
          </p>
          <h2 id="home-ventures-title" className="text-h2 max-w-[14ch] text-ink">
            From classroom to company.
          </h2>
          <p className="mt-6 max-w-md text-muted">
            The programme is designed for people who carry their work forward into healthcare
            startups. Each venture is tracked by product, technology readiness, team and funding.
          </p>
          <MoreLink href="/startups" className="mt-8">All ventures</MoreLink>
        </Reveal>

        <div className="lg:col-span-7">
          {featured.length ? (
            <ol className="border-t border-ink">
              {featured.map((v, i) => (
                <Reveal as="li" key={v.id} delay={i * 0.06} className="border-b border-line">
                  <Link prefetch={false} href={`/startups/${v.slug}`} className="group grid gap-4 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                    <span>
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="text-[1.5rem] leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-blue">
                          {v.name}
                        </span>
                        {v.provenance === "sample" && <SampleBadge />}
                      </span>
                      <span className="mt-1 block text-ink-2">{v.tagline}</span>
                    </span>
                    <span className="flex items-center gap-6">
                      <TrlMeter trl={v.trl} scale={scale} compact />
                      <ArrowRight aria-hidden className="size-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ol>
          ) : (
            <div className="border-t border-ink pt-8">
              <p className="text-h3 text-ink">Venture profiles are being verified.</p>
              <p className="mt-3 max-w-md text-muted">
                Student and faculty ventures will appear here once their details are confirmed with
                the founders.
              </p>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent("Startup listing")}`}
                className="mt-6 inline-block text-[0.95rem] font-medium text-blue"
              >
                <span className="link-line">Get your venture listed</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
