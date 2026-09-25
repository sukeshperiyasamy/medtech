import { ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

export function AnnouncementBar({ announcement }: { announcement: SiteConfig["announcement"] }) {
  if (!announcement) return null;
  return (
    <div className="border-b border-line bg-paper">
      <div className="container-x flex h-10 items-center gap-3 text-[0.8rem]">
        <span className="eyebrow hidden shrink-0 !text-blue sm:inline">{announcement.tag}</span>
        <span aria-hidden className="hidden h-3 w-px bg-line-strong sm:inline" />
        <a
          href={announcement.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 items-center gap-1.5 text-ink-2 hover:text-ink"
        >
          <span className="truncate">{announcement.label}</span>
          <ArrowUpRight aria-hidden className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">(opens official IIT Jodhpur page)</span>
        </a>
      </div>
    </div>
  );
}
