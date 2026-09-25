"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

interface Props {
  images: GalleryImage[];
  /** Index of the open image, or null when closed. */
  index: number | null;
  onChange: (index: number | null) => void;
  title?: string;
}

const SWIPE_PX = 50;

/**
 * Full-screen photo viewer on <dialog>: native focus trap and Escape, ← → keys,
 * on-screen buttons, touch swipe, a "24 / 143" counter, and the next photo preloaded.
 */
export function Lightbox({ images, index, onChange, title }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
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

  const meta = img ? [img.caption, img.date && formatDateRange(img.date)].filter(Boolean).join(" · ") : "";
  const next = index !== null && images.length > 1 ? images[(index + 1) % images.length] : null;

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
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[rgb(10_15_25/0.94)]"
    >
      {img && (
        <div className="flex h-full flex-col text-white">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="font-mono text-xs tracking-[0.08em] text-white/75" aria-live="polite">
              {index! + 1} / {images.length}
              {title && <span className="ml-3 hidden text-white/50 sm:inline">{title}</span>}
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
              <Image key={img.id} src={img.src} alt={img.alt} fill sizes="(min-width: 1280px) 1200px, (min-width: 640px) 92vw, 100vw" className="object-contain" />
            </div>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/30 text-white hover:bg-white/15 sm:inline-flex sm:left-4"
                >
                  <ChevronLeft className="size-6" aria-hidden />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-sm bg-black/30 text-white hover:bg-white/15 sm:inline-flex sm:right-4"
                >
                  <ChevronRight className="size-6" aria-hidden />
                  <span className="sr-only">Next photo</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 pb-5 pt-3 sm:justify-center sm:px-6">
            {/* Touch-size prev/next on phones (swipe also works) */}
            <button type="button" onClick={() => go(-1)} className="inline-flex size-11 items-center justify-center rounded-sm text-white/80 sm:hidden">
              <ChevronLeft className="size-6" aria-hidden />
              <span className="sr-only">Previous photo</span>
            </button>
            <p className="min-h-5 text-center text-sm text-white/85">{meta}</p>
            <button type="button" onClick={() => go(1)} className="inline-flex size-11 items-center justify-center rounded-sm text-white/80 sm:hidden">
              <ChevronRight className="size-6" aria-hidden />
              <span className="sr-only">Next photo</span>
            </button>
          </div>

          {/* Preload the next photo so browsing feels instant */}
          {next && (
            <div aria-hidden className="pointer-events-none absolute size-px overflow-hidden opacity-0">
              <Image src={next.src} alt="" fill sizes="(min-width: 1280px) 1200px, (min-width: 640px) 92vw, 100vw" loading="eager" />
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
