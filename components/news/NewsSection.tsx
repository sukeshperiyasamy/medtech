import { ArrowUpRight } from "lucide-react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { getNews, getSite } from "@/lib/data";
import { formatDateRange } from "@/lib/utils";

export async function NewsSection({ index, heading = true }: SectionProps = {}) {
  const [items, site] = await Promise.all([getNews(), getSite()]);
  const featured = items.find((n) => n.featured) ?? items[0];
  const rest = items.filter((n) => n.id !== featured.id);

  return (
    <section id="news" aria-labelledby={heading ? "news-title" : undefined} className="section-y border-t border-line">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="news-title"
          index={index}
          label="News & events"
          title="From the Center."
          intro="Conferences, admissions and announcements from IIT Jodhpur and AIIMS Jodhpur."
        />
        )}

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal as="article" className="lg:col-span-7">
            <a href={featured.link?.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="overflow-hidden">
                <div className="transition-transform duration-[1.2s] ease-[var(--ease-precise)] group-hover:scale-[1.02]">
                  <ImagePlaceholder ratio="16 / 9" brief="ICMI 2025 — plenary or hackathon photograph, IIT Jodhpur / AIIMS Jodhpur" />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="eyebrow !text-blue">{featured.category}</span>
                <time className="eyebrow" dateTime={featured.date}>
                  {formatDateRange(featured.date, featured.endDate)}
                </time>
              </div>
              <h3 className="text-h3 mt-3 max-w-[26ch] text-ink transition-colors group-hover:text-blue">{featured.title}</h3>
              <p className="mt-3 max-w-2xl text-ink-2">{featured.summary}</p>
              {featured.venue && <p className="mt-3 text-sm text-muted">{featured.venue}</p>}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                {featured.link?.label}
                <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </span>
            </a>
          </Reveal>

          <div className="lg:col-span-5">
            <ul className="border-t border-ink">
              {rest.map((n, i) => (
                <Reveal as="li" key={n.id} delay={i * 0.06} className="border-b border-line">
                  <a href={n.link?.url} target="_blank" rel="noopener noreferrer" className="group block py-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="eyebrow !text-blue">{n.category}</span>
                      <time className="eyebrow" dateTime={n.date}>
                        {formatDateRange(n.date, n.endDate)}
                      </time>
                    </div>
                    <h3 className="mt-2 text-[1.2rem] leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-blue">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-[0.93rem] text-muted">{n.summary}</p>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Reveal>
              ))}
            </ul>
            <a
              href={site.officialUrl.replace("medical-technologies/en/medical-technologies", "medical-technologies/en/news-event")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-blue"
            >
              <span className="link-line">All news & events</span>
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
