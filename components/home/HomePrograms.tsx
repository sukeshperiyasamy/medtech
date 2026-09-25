import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { getPrograms } from "@/lib/data";

export async function HomePrograms({ index }: { index?: string }) {
  const programs = await getPrograms();
  return (
    <section id="programs" aria-labelledby="home-programs-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5 flex items-center gap-3">
            {index && <span className="text-blue">{index}</span>}
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>Programmes</span>
          </p>
          <h2 id="home-programs-title" className="text-h2 text-ink">Doctors and engineers, in the same classroom.</h2>
          <p className="mt-6 max-w-sm text-muted">
            Master&rsquo;s and PhD in Medical Technologies, offered jointly by IIT Jodhpur and AIIMS
            Jodhpur — and upcoming programmes in Digital Health.
          </p>
          <MoreLink href="/programs" className="mt-8">Programme details</MoreLink>
        </Reveal>

        <ul className="border-t border-ink lg:col-span-8">
          {programs.map((p, i) => {
            const apply = p.admission?.find((l) => l.label.toLowerCase().includes("apply"));
            return (
              <Reveal as="li" key={p.id} delay={i * 0.05} className="grid gap-4 border-b border-line py-7 sm:grid-cols-[9rem_1fr_auto] sm:gap-8">
                <p className="eyebrow pt-1.5">{p.degree}</p>
                <div>
                  <h3 className="text-[1.45rem] leading-tight tracking-[-0.02em] text-ink">
                    <Link href={`/programs#${p.id}`} className="hover:text-blue">{p.title}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 max-w-xl text-[0.95rem] text-muted">{p.overview}</p>
                </div>
                {apply && (
                  <a
                    href={apply.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-10 items-center gap-1.5 self-start rounded-sm border border-line-strong px-4 text-sm font-medium text-ink transition-colors hover:border-ink"
                  >
                    Apply
                    <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">to the {p.title} (opens in a new tab)</span>
                  </a>
                )}
              </Reveal>
            );
          })}
          <li className="grid gap-4 py-7 sm:grid-cols-[9rem_1fr_auto] sm:gap-8">
            <p className="eyebrow pt-1.5">Digital Health</p>
            <div>
              <h3 className="text-[1.45rem] leading-tight tracking-[-0.02em] text-ink">
                <Link href="/digital-health#cdh-programs" className="hover:text-blue">Programmes in Digital Health</Link>
              </h3>
              <p className="mt-2 max-w-xl text-[0.95rem] text-muted">
                Certificate, Diploma, MBA, M.Tech and MS (Research) programmes from the Centre for
                Digital Health.
              </p>
            </div>
            <span className="self-start rounded-xs border border-blue/30 bg-blue-soft px-2 py-1 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-blue">
              Upcoming
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
