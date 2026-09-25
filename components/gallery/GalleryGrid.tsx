"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

/** Target row height (px) of the justified grid; rows stretch to fill the width. */
const ROW = { base: 150, sm: 210, lg: 260 };

/**
 * All photos in one editorial, justified grid: every image keeps its own aspect ratio,
 * rows fill the full width, order is chronological (newest first). Pure CSS layout, so
 * it renders on the server with no layout shift. Images lazy-load near the viewport and
 * sit on their dominant colour until they arrive. Any photo opens the lightbox.
 */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const years = useMemo(
    () =>
      Array.from(new Set(images.map((i) => i.date?.slice(0, 4)).filter(Boolean) as string[])).sort((a, b) =>
        b.localeCompare(a),
      ),
    [images],
  );
  const [year, setYear] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(
    () => (year === "all" ? images : images.filter((i) => i.date?.startsWith(year))),
    [images, year],
  );

  return (
    <div>
      <div className="border-b border-ink pb-4">
        <div role="group" aria-label="Filter by year" className="flex flex-wrap gap-1">
          {["all", ...years].map((y) => {
                        const on = y === year;
            return (
              <button
                key={y}
                type="button"
                aria-pressed={on}
                onClick={() => setYear(y)}
                className={cn(
                  "h-9 rounded-sm px-3.5 text-[0.88rem] transition-colors",
                  on ? "bg-ink text-white" : "text-ink-2 hover:bg-mist",
                )}
              >
                                {y === "all" ? "All" : y}
              </button>
            );
          })}
        </div>
        {/* Announce filter changes to screen readers only */}
        <p className="sr-only" aria-live="polite">
          Showing {year === "all" ? "all photographs" : `photographs from ${year}`}
        </p>
      </div>

      <ul
        className="mt-8 flex flex-wrap gap-2.5 [--row:150px] after:grow-[1000000] after:content-[''] sm:gap-3.5 sm:[--row:210px] lg:[--row:260px]"
        aria-label="Photographs"
      >
        {shown.map((img, i) => {
          const r = img.width / img.height;
          return (
            <li
              key={img.id}
              style={{ flexGrow: r * 100, flexBasis: `calc(${r} * var(--row))` }}
              className="min-w-0"
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden border border-line"
                style={{ backgroundColor: img.color }}
              >
                <span aria-hidden className="block" style={{ paddingBottom: `${100 / r}%` }} />
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={`(min-width: 1024px) ${Math.round(r * ROW.lg * 1.5)}px, (min-width: 640px) ${Math.round(r * ROW.sm * 1.5)}px, ${Math.round(r * ROW.base * 1.6)}px`}
                  priority={i < 4}
                  className="object-cover transition-[transform,filter] duration-700 ease-[var(--ease-precise)] group-hover:scale-[1.015] group-hover:brightness-[0.92]"
                />
                {img.caption && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ink/70 px-3 py-2 text-left text-[0.78rem] text-white transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    {img.caption}
                  </span>
                )}
                <span className="sr-only">Open photo {i + 1} of {shown.length}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox images={shown} index={open} onChange={setOpen} title="Gallery" />
    </div>
  );
}
