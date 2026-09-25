import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * IIT Jodhpur × AIIMS Jodhpur identity. Both official marks are shown at the same
 * height, unmodified, with equal weight — neither institution is subordinate.
 */
export function BrandLockup({ site, compact = false, className }: { site: SiteConfig; compact?: boolean; className?: string }) {
  const [iitj, aiims] = site.institutions;
  const size = compact ? 34 : 40;
  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label={`${site.name}, ${site.partners} — home`}>
      <span className="flex items-center gap-2">
        <Image src={iitj.logo.src} alt="" width={size} height={Math.round(size * 1.1)} className="h-auto" style={{ width: size * 0.9 }} priority />
        <span aria-hidden className="font-mono text-xs text-muted">×</span>
        <Image src={aiims.logo.src} alt="" width={size} height={size} priority />
      </span>
      <span aria-hidden className="h-8 w-px bg-line" />
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[0.88rem] font-medium tracking-[-0.01em] text-ink sm:text-[0.95rem]">
          {site.name}
        </span>
        <span className="eyebrow hidden whitespace-nowrap !text-[0.62rem] sm:block">{site.partners}</span>
      </span>
    </Link>
  );
}
