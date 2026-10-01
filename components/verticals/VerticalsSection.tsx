import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { getCentrePhoto, getSite, getVerticals } from "@/lib/data";
import { pad2 } from "@/lib/utils";

/** The Centre's approved verticals. Digital Health stays in the data until it is approved. */
export async function VerticalsSection({
  showPhoto = false,
}: {
  index?: string;
  heading?: boolean;
  /** Show the Centre's building (homepage). */
  showPhoto?: boolean;
}) {
  const [allVerticals, site, photo] = await Promise.all([getVerticals(), getSite(), getCentrePhoto()]);
  const verticals = allVerticals.filter((v) => v.id !== "digital-health");
  const logo = (name: string) => site.institutions.find((i) => i.name === name)?.logo;

  return (
    <section id="verticals" aria-label="Medical Technologies Program" className="section-y border-t border-line">
      <div className="container-x">
        {showPhoto && (
          <Reveal className="mb-14 lg:mb-20">
            <figure>
              <div className="overflow-hidden bg-mist">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="aspect-[16/10] w-full object-cover object-[50%_40%]"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted">{photo.caption}</span>
                <span className="eyebrow hidden shrink-0 sm:inline">The Centre</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        <div className={`grid border-t border-ink ${verticals.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {verticals.map((v, i) => (
            <Reveal
              as="article"
              key={v.id}
              delay={i * 0.1}
              className={`flex flex-col py-10 lg:py-12 ${verticals.length > 1 ? (i === 0 ? "border-b border-line lg:border-b-0 lg:border-r lg:pr-12" : "lg:pl-12") : ""}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Vertical {pad2(i + 1)}</p>
                <div className="flex items-center gap-2" aria-label={`Run by ${v.institutions.join(" and ")}`}>
                  {v.institutions.map((name, n) => {
                    const l = logo(name);
                    return (
                      <span key={name} className="flex items-center gap-2">
                        {n > 0 && <span aria-hidden className="font-mono text-xs text-muted">×</span>}
                        {l && <Image src={l.src} alt={l.alt} width={40} height={40} className="h-10 w-auto" style={{ width: "auto", height: "auto" }} />}
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
