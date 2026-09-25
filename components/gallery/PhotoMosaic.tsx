"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/types";
import { Lightbox } from "./Lightbox";

/** Ordered 4:3 grid of an event's photos; each opens the full image in the lightbox. */
export function PhotoMosaic({ images, title }: { images: GalleryImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.id}>
            <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left">
              <span className="block overflow-hidden bg-mist">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-precise)] group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-2 flex items-baseline justify-between gap-3">
                <span className="text-[0.9rem] text-ink-2 group-hover:text-ink">{img.caption}</span>
                <span className="font-mono text-[0.68rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={open} onChange={setOpen} title={title} />
    </>
  );
}
