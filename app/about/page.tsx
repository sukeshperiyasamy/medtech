import Image from "next/image";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { VerticalsSection } from "@/components/verticals/VerticalsSection";
import { CentreVideo } from "@/components/about/CentreVideo";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
import { getCentrePhoto, getCentreVideo, getPeople, getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { isRemote } from "@/lib/utils";

export const metadata = pageMetadata(
  "About the Centre",
  "The Medical Technology Centre at IIT Jodhpur — home to the Medical Technologies Program with AIIMS Jodhpur and the Centre for Digital Health.",
  "/about",
);

export default async function AboutPage() {
  const [site, leaders, photo] = await Promise.all([
    getSite(),
    getPeople("Leadership"),
    getCentrePhoto(),
  ]);
  const video = await getCentreVideo();
  const iitj = site.institutions[0];

  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "About" }]}
        label="About the Centre"
        title="One Centre for medical technology at IIT Jodhpur."
        intro={site.description}
      >
        <div className="mt-10 flex items-center gap-3">
          <Image
            src={iitj.logo.src}
            alt={iitj.logo.alt}
            width={40}
            height={44}
            className="h-11 w-auto"
          />
          <p className="text-sm text-muted">
            {site.name} · {site.parent}
          </p>
        </div>
      </PageHeader>

      <figure className="container-x pt-12 lg:pt-16">
        <div className="overflow-hidden bg-mist">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1360px) 1264px, 100vw"
            priority
            className="aspect-[4/3] w-full object-cover object-[50%_35%] sm:aspect-[21/9]"
          />
        </div>
        <figcaption className="mt-3 text-sm text-muted">{photo.caption}</figcaption>
      </figure>

      <VerticalsSection index="01" />
      <CentreVideo index="02" src={video.src} poster={video.poster} duration={video.duration} />

      <section
        aria-labelledby="leadership-title"
        className="section-y border-t border-line bg-paper"
      >
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="text-blue">03</span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
              <span>Leadership</span>
            </p>
            <h2 id="leadership-title" className="text-h2 text-ink">
              Who leads the Centre.
            </h2>
            <MoreLink href="/people" className="mt-8">
              Faculty &amp; staff
            </MoreLink>
          </Reveal>
          <ul className="border-t border-ink lg:col-span-8">
            {leaders.map((p, i) => (
              <Reveal
                as="li"
                key={p.id}
                delay={i * 0.06}
                className="grid gap-5 border-b border-line py-7 sm:grid-cols-[5.5rem_1fr]"
              >
                {p.photo ? (
                  <Image
                    src={p.photo.src}
                    alt={p.photo.alt}
                    width={88}
                    height={110}
                    unoptimized={isRemote(p.photo.src)}
                    className="aspect-[4/5] w-[5.5rem] object-cover object-top"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex aspect-[4/5] w-[5.5rem] items-center justify-center bg-mist font-mono text-sm text-muted"
                  >
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
                <div>
                  <h3 className="text-[1.5rem] leading-tight tracking-[-0.02em] text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-muted">{p.designation}</p>
                  {p.researchInterests.length > 0 && (
                    <p className="mt-3 text-[0.9rem] text-ink-2">
                      {p.researchInterests.join(" · ")}
                    </p>
                  )}
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="mt-3 inline-flex items-center gap-2 text-[0.9rem] text-ink hover:text-blue"
                    >
                      <Mail aria-hidden className="size-4 text-muted" />
                      <span className="link-line break-all">{p.email}</span>
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
