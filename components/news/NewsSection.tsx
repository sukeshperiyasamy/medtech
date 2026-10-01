import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PhotoMosaic } from "@/components/gallery/PhotoMosaic";
import { getGallery, getNews, getSite } from "@/lib/data";
import { formatDateRange } from "@/lib/utils";
import type { NewsItem, TalkKind } from "@/lib/types";

const TALK_GROUPS: { kind: TalkKind; label: string }[] = [
  { kind: "Invited talk", label: "Invited talks" },
  { kind: "Discussion", label: "Discussions" },
];

export async function NewsSection({ index, heading = true }: SectionProps = {}) {
  const [items, site] = await Promise.all([getNews(), getSite()]);
  const talks = items.filter((n) => n.category === "Talk");
  const news = items.filter((n) => n.category !== "Talk");
  const featured = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n.id !== featured?.id);
  const photos = featured ? await getGallery(featured.id) : [];

  return (
    <section id="news" aria-labelledby={heading ? "news-title" : undefined} className="section-y border-t border-line">
      <div className="container-x">
        {heading && (
          <SectionHeading
            id="news-title"
            index={index}
            label="News & events"
            title="From the Centre."
            intro="Conferences, admissions and announcements — and discussions and invited talks — from IIT Jodhpur and AIIMS Jodhpur."
          />
        )}

        <div className={`grid gap-12 lg:grid-cols-12 lg:gap-10 ${heading ? "mt-14 lg:mt-20" : ""}`}>
          {featured && (
          <Reveal as="article" className="lg:col-span-7">
            <a href={featured.link?.url} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="overflow-hidden bg-mist">
                {featured.image ? (
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    width={featured.image.width ?? 2000}
                    height={featured.image.height ?? 1500}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    preload
                    className="aspect-[16/10] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-precise)] group-hover:scale-[1.02]"
                  />
                ) : (
                  <ImagePlaceholder ratio="16 / 10" brief={`Photograph — ${featured.title}`} />
                )}
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
          )}

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
              <span className="link-line">Official news & events page</span>
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>

        <section id="talks" aria-labelledby="talks-title" className="mt-24 scroll-mt-28 border-t border-line pt-10 lg:mt-32">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-3">Talks</p>
            <h2 id="talks-title" className="text-h2 text-ink">Discussions and invited talks.</h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {TALK_GROUPS.map((group) => {
              const groupItems = talks.filter((t) => (t.talkKind ?? "Invited talk") === group.kind);
              return (
                <div key={group.kind}>
                  <h3 className="border-b border-ink pb-3 text-[1.15rem] font-medium tracking-[-0.02em] text-ink">
                    {group.label}
                  </h3>
                  {groupItems.length === 0 ? (
                    <p className="py-6 text-sm text-muted">None listed yet.</p>
                  ) : (
                    <ul>
                      {groupItems.map((talk) => (
                        <TalkRow key={talk.id} talk={talk} />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {photos.length > 0 && featured && (
          <section id={featured.id} aria-labelledby="gallery-title" className="mt-24 scroll-mt-28 border-t border-line pt-10 lg:mt-32">
            <div className="mb-10 grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-7">
                <p className="eyebrow mb-3">Gallery</p>
                <h2 id="gallery-title" className="text-h2 text-ink">{featured.title}</h2>
              </div>
              <p className="text-muted lg:col-span-5">
                {formatDateRange(featured.date, featured.endDate)}
                {featured.venue && ` · ${featured.venue}`}
              </p>
            </div>
            <PhotoMosaic images={photos} title="ICMI 2025" />
          </section>
        )}
      </div>
    </section>
  );
}

function TalkRow({ talk }: { talk: NewsItem }) {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <time className="eyebrow" dateTime={talk.date}>
          {formatDateRange(talk.date, talk.endDate)}
        </time>
        {talk.venue && <span className="eyebrow">{talk.venue}</span>}
      </div>
      <h4 className="mt-2 text-[1.15rem] leading-snug tracking-[-0.015em] text-ink group-hover:text-blue">
        {talk.title}
      </h4>
      {talk.speaker && <p className="mt-1 text-sm text-ink-2">{talk.speaker}</p>}
      <p className="mt-2 text-[0.93rem] text-muted">{talk.summary}</p>
    </>
  );

  return (
    <li className="border-b border-line py-6">
      {talk.link ? (
        <a href={talk.link.url} target="_blank" rel="noopener noreferrer" className="group block">
          {body}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <article className="group">{body}</article>
      )}
    </li>
  );
}
