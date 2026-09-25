"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

interface Props {
  images: GalleryImage[];
  title: string;
  /** Row height in px; widths follow each photo's aspect ratio. */
  height?: number;
  /** Seconds per photo — lower is faster. */
  secondsPerImage?: number;
}

/**
 * Continuous, slow-moving photo strip. Pauses on hover/focus and via a visible
 * control (WCAG 2.2.2); becomes a plain scrollable row under reduced motion.
 * Every photo opens the lightbox.
 */
export function PhotoMarquee({ images, title, height = 280, secondsPerImage = 6 }: Props) {
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const renderSet = (clone: boolean) => (
    <ul className={cn("flex shrink-0", clone && "marquee-clone")} aria-hidden={clone || undefined}>
      {images.map((img, i) => {
        const w = Math.round((height * img.width) / img.height);
        return (
          <li key={`${clone ? "c" : "o"}-${img.id}`} className="shrink-0 pr-3 sm:pr-4">
            <button
              type="button"
              tabIndex={clone ? -1 : 0}
              onClick={() => setOpen(i)}
              className="group relative block overflow-hidden bg-mist"
              style={{ width: w, height }}
            >
              <Image
                src={img.src}
                alt={clone ? "" : img.alt}
                width={w}
                height={height}
                sizes={`${w}px`}
                loading="lazy"
                className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-precise)] group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent px-3 pb-2.5 pt-8 text-left text-[0.8rem] text-white transition-transform duration-500 ease-[var(--ease-precise)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                {img.caption}
              </span>
              {!clone && <span className="sr-only">Open photo: {img.caption}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="marquee relative" data-paused={paused}>
      <div
        className="marquee-viewport overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
        role="region"
        aria-label={`${title} — photo strip`}
      >
        <div
          className="marquee-track flex w-max"
          style={{ ["--marquee-duration" as string]: `${images.length * secondsPerImage}s` }}
        >
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      <div className="container-x mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {images.length} photographs · select any photo to enlarge
        </p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line px-3 text-[0.82rem] text-ink-2 transition-colors hover:border-ink hover:text-ink motion-reduce:hidden"
        >
          {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <Lightbox images={images} index={open} onChange={setOpen} title={title} />
    </div>
  );
}
