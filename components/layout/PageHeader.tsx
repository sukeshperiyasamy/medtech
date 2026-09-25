import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

interface Crumb {
  label: string;
  href?: string;
}

/** Title block for inner pages: breadcrumbs, label, headline, intro. */
export function PageHeader({
  label,
  title,
  intro,
  crumbs,
  children,
}: {
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
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
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div className="container-x relative pb-14 pt-10 lg:pb-20 lg:pt-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {trail.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="hover:text-ink">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-ink">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="anim-fade-up mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5">{label}</p>
            <h1 className="text-[clamp(2.4rem,1.3rem+3.6vw,4.6rem)] font-medium leading-[1.03] tracking-[-0.035em] text-ink">
              {title}
            </h1>
          </div>
          {intro && <p className="text-lead text-muted lg:col-span-4 lg:pb-2">{intro}</p>}
        </div>
        {children}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </header>
  );
}
