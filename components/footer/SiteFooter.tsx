import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

export function SiteFooter({ site }: { site: SiteConfig }) {
  const official = [
    { label: "Official Medical Technologies page", url: site.officialUrl },
    { label: "People directory", url: "https://www.iitj.ac.in/People?dept=Medical-Technologies" },
    { label: "Centre for Digital Health", url: "https://www.iitj.ac.in/cdh" },
    { label: "ICMI conference", url: "https://events.iitj.ac.in/icmi/" },
  ];

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            {site.institutions.map((inst, i) => (
              <span key={inst.name} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="font-mono text-xs text-muted">×</span>}
                <Image src={inst.logo.src} alt={inst.logo.alt} width={48} height={48} className="h-12 w-auto" />
              </span>
            ))}
          </div>
          <p className="mt-6 text-xl font-medium tracking-[-0.015em] text-ink">{site.name}</p>
          <p className="eyebrow mt-1">{site.partners}</p>
          <address className="mt-6 text-[0.93rem] not-italic leading-relaxed text-muted">
            {site.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <p className="mt-4 text-[0.93rem]">
            <a href={`mailto:${site.email}`} className="link-line text-ink">{site.email}</a>
            <br />
            <span className="text-muted">{site.phone}</span>
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-2.5 text-[0.93rem]">
              {[...site.nav.flatMap((n) => n.children ?? [n]), { label: "Startups", href: "/startups" }, { label: "Contact", href: "/contact" }]
                .filter((n, i, all) => all.findIndex((m) => m.href === n.href) === i)
                .map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="link-line text-ink-2 hover:text-ink">{n.label}</Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Institutions</p>
            <ul className="space-y-2.5 text-[0.93rem]">
              {site.institutions.map((inst) => (
                <li key={inst.name}>
                  <a href={inst.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                    <span className="link-line">{inst.name}</span>
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </li>
              ))}
              <li>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                  <span className="link-line">Directions</span>
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow mb-4">Official resources</p>
            <ul className="space-y-2.5 text-[0.93rem]">
              {official.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-2 hover:text-ink">
                    <span className="link-line">{l.label}</span>
                    <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
                  </a>
                </li>
              ))}
              {site.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-line text-ink-2 hover:text-ink">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Medical Technologies Center, IIT Jodhpur × AIIMS Jodhpur.</p>
          <p>Institutional information sourced from official IIT Jodhpur pages.</p>
        </div>
      </div>
    </footer>
  );
}
