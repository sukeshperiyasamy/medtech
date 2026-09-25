import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { SectionProps } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { getCentrePhoto, getCollaborationPathways, getSite } from "@/lib/data";
import { pad2 } from "@/lib/utils";

export async function CollaborationSection({ index, heading = true }: SectionProps = {}) {
  const [pathways, site, photo] = await Promise.all([
    getCollaborationPathways(),
    getSite(),
    getCentrePhoto(),
  ]);
  return (
    <section
      id="collaborate"
      aria-labelledby={heading ? "collab-title" : undefined}
      className="section-y"
    >
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            {heading && (
              <Reveal>
                <p className="eyebrow mb-5 flex items-center gap-3">
                  {index && (
                    <>
                      <span className="text-blue">{index}</span>
                      <span aria-hidden className="h-px w-8 bg-line-strong" />
                    </>
                  )}
                  <span>Collaborate</span>
                </p>
                <h2 id="collab-title" className="text-h2 max-w-[14ch] text-ink">
                  Build the future of healthcare with us.
                </h2>
                <p className="text-lead mt-6 max-w-md text-muted">
                  Five ways in — whichever side of the clinic, lab or market you are coming from.
                </p>
              </Reveal>
            )}
            <Reveal
              delay={0.1}
              className={
                heading
                  ? "mt-10 border-t border-line pt-6 text-[0.95rem]"
                  : "border-t border-ink pt-6 text-[0.95rem]"
              }
            >
              <p className="eyebrow mb-3">Contact the Centre</p>
              <a href={`mailto:${site.email}`} className="link-line text-lg text-ink">
                {site.email}
              </a>
              <p className="mt-1 text-muted">{site.phone}</p>
              {!heading && (
                <>
                  <figure className="mt-8">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 34vw, 100vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <figcaption className="mt-2 text-xs text-muted">
                      Find us: look for the W16 Berm sign.
                    </figcaption>
                  </figure>
                  <address className="mt-6 not-italic leading-relaxed text-ink-2">
                    {site.address.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <a
                    href={site.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-blue"
                  >
                    Directions <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens Google Maps)</span>
                  </a>
                </>
              )}
            </Reveal>
          </div>
        </div>

        <ol className="border-t border-ink lg:col-span-7">
          {pathways.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.05} className="border-b border-line">
              <a
                href={p.cta.url}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-7 sm:py-8"
              >
                <span className="pt-1 font-mono text-xs text-muted transition-colors group-hover:text-blue">
                  {pad2(i + 1)}
                </span>
                <span>
                  <span className="eyebrow block">{p.audience}</span>
                  <span className="mt-2 block text-[1.6rem] leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-blue sm:text-[1.9rem]">
                    {p.title}
                  </span>
                  <span className="mt-2 block max-w-lg text-[0.97rem] text-muted">
                    {p.description}
                  </span>
                  <span className="mt-4 inline-block text-sm font-medium text-ink">
                    {p.cta.label}
                  </span>
                </span>
                <span className="mt-1 inline-flex size-10 items-center justify-center rounded-sm border border-line transition-all duration-300 group-hover:border-blue group-hover:bg-blue group-hover:text-white">
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
