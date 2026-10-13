import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

interface Crumb {
  label: string;
  href?: string;
}

export function FundingHero({
  crumbs = [{ label: "Research", href: "/research" }, { label: "Funding & Grants" }],
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />
      <div className="container-x relative pb-12 pt-8 lg:pb-16 lg:pt-12">
        {/* Breadcrumb */}
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

        {/* Hero Title & Editorial Narrative */}
        <div className="anim-fade-up mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-4">Funding & Grants</p>
            <h1 className="text-[clamp(2.3rem,1.4rem+3.2vw,4.2rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
              Funding medical innovation from research to translation.
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-1">
            <p className="text-[0.98rem] leading-relaxed text-muted">
              The Centre connects clinical researchers, bio-engineers, and student entrepreneurs with competitive government schemes, translational grants, venture seed capital, and prestigious national fellowships.
            </p>
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
