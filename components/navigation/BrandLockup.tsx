import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Centre identity: the Medical Technology Centre belongs to IIT Jodhpur, so the header
 * carries the IIT Jodhpur mark only (unmodified). The AIIMS Jodhpur partnership is shown
 * with the Medical Technologies Program it belongs to.
 */
export function BrandLockup({ site, compact = false, className }: { site: SiteConfig; compact?: boolean; className?: string }) {
  const iitj = site.institutions.find((i) => i.name === "IIT Jodhpur") ?? site.institutions[0];
  const size = compact ? 38 : 44;
  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-3", className)} aria-label={`${site.name}, ${site.parent} — home`}>
      <Image
        src={iitj.logo.src}
        alt=""
        width={size}
        height={Math.round(size * 1.1)}
        className="h-auto shrink-0"
        style={{ width: size * 0.9 }}
        priority
      />
      <span aria-hidden className="h-8 w-px bg-line" />
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-[0.92rem] font-medium tracking-[-0.01em] text-ink sm:text-[0.98rem]">
          {site.name}
        </span>
        <span className="eyebrow block whitespace-nowrap !text-[0.62rem]">{site.parent}</span>
      </span>
    </Link>
  );
}
