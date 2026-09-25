import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { getCentrePhoto, getSite, getVerticals } from "@/lib/data";
import { pad2 } from "@/lib/utils";

/** The Centre's two verticals, side by side — the main entry points of the site. */
export async function VerticalsSection({
  index,
  heading = true,
  showPhoto = false,
}: {
  index?: string;
  heading?: boolean;
  /** Show the Centre's building beside the heading (homepage). */
  showPhoto?: boolean;
}) {
  const [verticals, site, photo] = await Promise.all([getVerticals(), getSite(), getCentrePhoto()]);
  const logo = (name: string) => site.institutions.find((i) => i.name === name)?.logo;

  return (
    <section id="verticals" aria-labelledby={heading ? "verticals-title" : undefined} className="section-y border-t border-line">
      <div className="container-x">
        {heading && (
          <Reveal className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className={showPhoto ? "lg:col-span-6" : "lg:col-span-7"}>
              <p className="eyebrow mb-5 flex items-center gap-3">
                {index && <span className="text-blue">{index}</span>}
                <span aria-hidden className="h-px w-8 bg-line-strong" />
                <span>Our verticals</span>
              </p>
              <h2 id="verticals-title" className="text-h2 text-ink">One Centre. Two verticals.</h2>
              {showPhoto && (
                <p className="text-lead mt-6 max-w-md text-muted">
                  The Medical Technology Centre at IIT Jodhpur brings the institute&rsquo;s medical
                  technology work under one umbrella.
                </p>
              )}
            </div>
            {showPhoto ? (
              <figure className="lg:col-span-6">
                <div className="overflow-hidden bg-mist">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="aspect-[16/10] w-full object-cover object-[50%_40%]"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-sm text-muted">{photo.caption}</span>
                  <span className="eyebrow hidden shrink-0 sm:inline">The Centre</span>
                </figcaption>
              </figure>
            ) : (
              <p className="text-lead text-muted lg:col-span-5">
                The Medical Technology Centre at IIT Jodhpur brings the institute&rsquo;s medical
                technology work under one umbrella.
              </p>
            )}
          </Reveal>
        )}

        <div className="grid border-t border-ink lg:grid-cols-2">
          {verticals.map((v, i) => (
            <Reveal
              as="article"
              key={v.id}
              delay={i * 0.1}
              className={`flex flex-col py-10 lg:py-12 ${i === 0 ? "border-b border-line lg:border-b-0 lg:border-r lg:pr-12" : "lg:pl-12"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Vertical {pad2(i + 1)}</p>
                <div className="flex items-center gap-2" aria-label={`Run by ${v.institutions.join(" and ")}`}>
                  {v.institutions.map((name, n) => {
                    const l = logo(name);
                    return (
                      <span key={name} className="flex items-center gap-2">
                        {n > 0 && <span aria-hidden className="font-mono text-xs text-muted">×</span>}
                        {l && <Image src={l.src} alt={l.alt} width={40} height={40} className="h-10 w-auto" />}
                      </span>
                    );
                  })}
                </div>
              </div>

              <h3 className="mt-8 text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
                {v.name}
              </h3>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-blue">
                {v.institutions.join(" × ")}
              </p>
              <p className="mt-6 text-[1.15rem] leading-snug tracking-[-0.01em] text-ink-2">&ldquo;{v.tagline}&rdquo;</p>
              <p className="mt-4 max-w-xl text-muted">{v.summary}</p>

              <ul className="mt-8 border-t border-line">
                {v.highlights.map((h) => (
                  <li key={h} className="flex gap-3 border-b border-line py-3 text-[0.95rem] text-ink">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-blue" />
                    {h}
                  </li>
                ))}
              </ul>

              <MoreLink href={v.href} className="mt-8">
                Explore {v.name}
              </MoreLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
