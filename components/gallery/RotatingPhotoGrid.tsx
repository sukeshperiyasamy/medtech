"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

type Photo = Pick<GalleryImage, "id" | "src" | "alt" | "width" | "height" | "color">;

const INTERVAL = 5000;
/** Delay between tiles within one change, so they turn over as a wave. */
const STAGGER = 250;

const sizesFor = (i: number) => (i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw");

/** One tile: two stacked layers; the new photo fades in only once it has loaded. */
function Tile({ photo, index }: { photo: Photo; index: number }) {
  const [layers, setLayers] = useState<[Photo, Photo | null]>([photo, null]);
  const [front, setFront] = useState<0 | 1>(0);

  // New photo requested: load it into the hidden layer (render-time state update).
  if (photo.id !== layers[front]?.id && photo.id !== layers[front === 0 ? 1 : 0]?.id) {
    const next: [Photo, Photo | null] = [...layers];
    next[front === 0 ? 1 : 0] = photo;
    setLayers(next);
  }
  const current = layers[front]!;

  return (
    <Link
      prefetch={false}
      href="/gallery"
      className="group relative block aspect-[4/3] size-full overflow-hidden border border-line"
      style={{ backgroundColor: current.color }}
    >
      {layers.map((p, layer) =>
        p ? (
          <Image
            key={p.id}
            src={p.src}
            alt={layer === front ? p.alt : ""}
            aria-hidden={layer !== front || undefined}
            fill
            sizes={sizesFor(index)}
            onLoad={() => layer !== front && p.id === photo.id && setFront(layer as 0 | 1)}
            className={cn(
              "object-cover transition-[opacity,transform,filter] duration-[900ms] ease-[var(--ease-precise)] group-hover:scale-[1.015] group-hover:brightness-[0.92]",
              // The new photo fades in on top; the previous one stays opaque underneath,
              // so the tile never dips to its background colour mid-change.
              layer === front ? "z-10 opacity-100" : p.id === photo.id ? "z-20 opacity-0" : "z-0 opacity-100",
            )}
          />
        ) : null,
      )}
      <span className="sr-only">Open the gallery</span>
    </Link>
  );
}

/**
 * Homepage "Life at the Centre" grid. Starts with the hand-picked photos, then every five
 * seconds each tile crossfades to another photo from the gallery. Pauses on hover/focus,
 * off-screen, in a background tab, via the Pause button (WCAG 2.2.2), and never runs
 * under prefers-reduced-motion.
 */
export function RotatingPhotoGrid({ initial, pool }: { initial: Photo[]; pool: Photo[] }) {
  const [shown, setShown] = useState(initial);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const queue = useRef<Photo[]>([]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const running = !paused && !hovered && visible && !reduced && pool.length > initial.length;

  useEffect(() => {
    if (!running) return;
    const next = (onScreen: Set<string>) => {
      for (let tries = 0; tries < pool.length; tries++) {
        if (!queue.current.length) {
          // Reshuffle the whole pool each round so every photo gets shown.
          queue.current = [...pool].sort(() => Math.random() - 0.5);
        }
        const p = queue.current.shift()!;
        if (!onScreen.has(p.id)) return p;
      }
      return null;
    };
    const timers: number[] = [];
    const tick = () => {
      if (document.hidden) return;
      initial.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => {
            setShown((cur) => {
              const p = next(new Set(cur.map((c) => c.id)));
              if (!p) return cur;
              const copy = [...cur];
              copy[i] = p;
              return copy;
            });
          }, i * STAGGER),
        );
      });
    };
    const id = window.setInterval(tick, INTERVAL);
    return () => {
      window.clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [running, pool, initial]);

  return (
    <div ref={ref}>
      <ul
        className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHovered(false)}
      >
        {shown.map((p, i) => (
          <li key={i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <Tile photo={p} index={i} />
          </li>
        ))}
      </ul>
      {!reduced && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line px-3 text-[0.82rem] text-ink-2 transition-colors hover:border-ink hover:text-ink"
          >
            {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
            {paused ? "Play" : "Pause"}
            <span className="sr-only"> changing photos</span>
          </button>
        </div>
      )}
    </div>
  );
}
