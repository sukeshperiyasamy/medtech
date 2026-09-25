import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { FromTheGallery } from "@/components/gallery/FromTheGallery";
import { getNews } from "@/lib/data";
import { formatDateRange } from "@/lib/utils";

export async function HomeNews({ index }: { index?: string }) {
  const all = await getNews();
  const items = all.slice(0, 3);
  return (
    <section id="news" aria-labelledby="home-news-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5 flex items-center gap-3">
            {index && <span className="text-blue">{index}</span>}
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>News &amp; events</span>
          </p>
          <h2 id="home-news-title" className="text-h2 text-ink">From the Centre.</h2>
          <MoreLink href="/news" className="mt-8">All news &amp; events</MoreLink>
          <MoreLink href="/achievements" className="mt-3 flex">Achievements</MoreLink>
        </Reveal>

        <ul className="border-t border-ink lg:col-span-8">
          {items.map((n, i) => (
            <Reveal as="li" key={n.id} delay={i * 0.05} className="border-b border-line">
              <a
                href={n.link?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-2 py-7 sm:grid-cols-[10rem_1fr_auto] sm:gap-8"
              >
                <span>
                  <time dateTime={n.date} className="eyebrow block">{formatDateRange(n.date, n.endDate)}</time>
                  <span className="eyebrow mt-1 block !text-blue">{n.category}</span>
                </span>
                <span>
                  <span className="block text-[1.3rem] leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-blue">
                    {n.title}
                  </span>
                  <span className="mt-2 line-clamp-2 block max-w-xl text-[0.93rem] text-muted">{n.summary}</span>
                </span>
                <ArrowUpRight aria-hidden className="hidden size-4 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue sm:block" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>

      <FromTheGallery />
    </section>
  );
}
