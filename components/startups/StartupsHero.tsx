import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

interface Crumb {
  label: string;
  href?: string;
}

export function StartupsHero({
  crumbs = [{ label: "Startups & Innovation" }],
}: {
  crumbs?: Crumb[];
}) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };

  return (
    <header className="relative overflow-hidden border-b border-line bg-white">
      {/* Precision background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="container-x relative pb-10 pt-8 lg:pb-14 lg:pt-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted">
            {trail.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link prefetch={false} href={c.href} className="hover:text-ink transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink font-medium">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Hero Content: Two-column Editorial Header */}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Column: Headline, Narrative & Action Buttons */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue-soft px-3 py-1 font-mono text-xs text-blue">
              <Sparkles className="size-3" />
              <span>MEDTECH INNOVATION</span>
            </div>

            <h1 className="mt-3.5 text-[clamp(2.2rem,1.3rem+3vw,3.8rem)] font-medium leading-[1.06] tracking-[-0.035em] text-ink text-balance">
              Engineering what healthcare needs next.
            </h1>

            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-2">
              At IIT Jodhpur, bedside clinical challenges identified with AIIMS Jodhpur
              are engineered into working prototypes, filed intellectual property, and venture-backed biomedical spinouts.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#ventures"
                className="inline-flex h-10 items-center gap-2 rounded-sm bg-ink px-4.5 text-xs sm:text-sm font-medium text-white hover:bg-ink-2 transition-colors shadow-2xs"
              >
                <span>Explore ventures</span>
                <ArrowDown className="size-3.5" />
              </a>

              <Link
                prefetch={false}
                href="/funding"
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-line bg-white px-4.5 text-xs sm:text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                <span>Funding &amp; grants</span>
                <ArrowUpRight className="size-3.5 text-blue" />
              </Link>
            </div>

            {/* Institutional verification note */}
            <div className="mt-6 flex items-center gap-2 text-xs text-muted border-t border-line/70 pt-3.5">
              <ShieldCheck className="size-3.5 text-teal-ink shrink-0" />
              <span>
                Incubated via IIT Jodhpur Technology Innovation &amp; Start-up Centre (TISC) in clinical collaboration with AIIMS Jodhpur.
              </span>
            </div>
          </div>

          {/* Right Column: Genuine Centre / Startup Event Photograph */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-line bg-paper shadow-2xs">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
                <Image
                  src="/images/gallery/2026-09-13_12-40-29_2.jpg"
                  alt="Founders presenting biomedical prototypes at IIT Jodhpur TISC Startup Meet & Greet"
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  priority
                  className="size-full object-cover"
                />
              </div>

              {/* Caption */}
              <div className="border-t border-line bg-white px-3.5 py-2.5 flex items-center justify-between text-[0.72rem] text-muted font-mono">
                <span className="text-ink font-medium">TISC Startup Meet &amp; Greet</span>
                <span>IIT Jodhpur</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </header>
  );
}
