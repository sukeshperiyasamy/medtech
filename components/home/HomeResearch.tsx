import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { getResearchAreas } from "@/lib/data";
import { pad2 } from "@/lib/utils";

export async function HomeResearch({ index }: { index?: string }) {
  const areas = await getResearchAreas();
  return (
    <section id="research" aria-labelledby="home-research-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-5 flex items-center gap-3">
              {index && <span className="text-blue">{index}</span>}
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span>Research</span>
            </p>
            <h2 id="home-research-title" className="text-h2 text-ink">Research that starts at the bedside.</h2>
            <p className="mt-6 max-w-sm text-muted">
              Six themes spanning sensing, imaging, robotics, materials, design and health systems —
              drawn from the expertise of the Centre&rsquo;s faculty.
            </p>
            <MoreLink href="/research" className="mt-8">Explore research</MoreLink>
          </div>
        </Reveal>

        <ol className="border-t border-ink lg:col-span-8">
          {areas.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 0.04} className="border-b border-line">
              <Link href={`/research#${a.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 sm:py-7">
                <span className="font-mono text-xs text-muted transition-colors group-hover:text-blue">{pad2(i + 1)}</span>
                <span>
                  <span className="block text-[1.35rem] leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-blue sm:text-[1.6rem]">
                    {a.title}
                  </span>
                  <span className="mt-2 hidden font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted sm:block">
                    {a.keywords.slice(0, 4).join("  ·  ")}
                  </span>
                </span>
                <ArrowRight aria-hidden className="size-5 -translate-x-2 text-blue opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
