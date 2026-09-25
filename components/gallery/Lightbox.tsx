"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { pad2 } from "@/lib/utils";

interface Props {
  images: GalleryImage[];
  /** Index of the open image, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
  title?: string;
}

/** Full-screen photo viewer built on <dialog> (native focus trap + Escape to close). */
export function Lightbox({ images, index, onChange, title }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const img = open ? images[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + images.length) % images.length);
  };

  return (
    <dialog
      ref={ref}
      aria-label={title ? `${title} — photo viewer` : "Photo viewer"}
      onClose={() => onChange(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onClick={(e) => e.target === ref.current && onChange(null)}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[rgb(10_15_25/0.92)]"
    >
      {img && (
        <div className="flex h-full flex-col text-white">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="font-mono text-xs tracking-[0.08em] text-white/70">
              {pad2(index! + 1)} / {pad2(images.length)}
              {title && <span className="ml-3 hidden sm:inline">{title}</span>}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex size-10 items-center justify-center rounded-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" aria-hidden />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <div className="relative h-full w-full">
              <Image
                key={img.id}
                src={img.src}
                alt={img.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/30 text-white hover:bg-white/15 sm:left-4"
            >
              <ChevronLeft className="size-6" aria-hidden />
              <span className="sr-only">Previous photo</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/30 text-white hover:bg-white/15 sm:right-4"
            >
              <ChevronRight className="size-6" aria-hidden />
              <span className="sr-only">Next photo</span>
            </button>
          </div>

          <p className="px-4 pb-5 pt-3 text-center text-sm text-white/85 sm:px-6" aria-live="polite">
            {img.caption}
          </p>
        </div>
      )}
    </dialog>
  );
}
