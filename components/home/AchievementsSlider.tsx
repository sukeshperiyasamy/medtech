"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface AchievementSlide {
  id: string;
  image: { src: string; alt: string; width: number; height: number };
}

const GAP = 20;

export function AchievementsSlider({ items }: { items: AchievementSlide[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const holding = userPaused || engaged;

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const distance = card.getBoundingClientRect().width + GAP;
    const max = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= max - 8) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir === -1 && el.scrollLeft <= 8) {
      el.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: dir * distance, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || holding) return;
    const id = window.setInterval(() => step(1), 5000);
    return () => window.clearInterval(id);
  }, [holding, step]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Achievements"
      className="relative border-b border-line bg-white"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEngaged(false);
      }}
    >
      <ul
        ref={scroller}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 py-6 [scrollbar-width:none] sm:px-8 sm:py-8 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            className="w-[min(88vw,34rem)] shrink-0 snap-start"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <div className="overflow-hidden border border-line bg-mist">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                priority={i === 0}
                sizes="(min-width: 1024px) 544px, 88vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 sm:bottom-10">
        <div className="flex justify-end px-5 sm:px-8 lg:px-10">
          <div className="pointer-events-auto flex items-center gap-1.5 border border-line bg-white/95 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex size-9 items-center justify-center text-ink transition-colors hover:bg-mist"
              aria-label="Previous photo"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex size-9 items-center justify-center text-ink transition-colors hover:bg-mist"
              aria-label="Next photo"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              className="inline-flex size-9 items-center justify-center text-ink transition-colors hover:bg-mist motion-reduce:hidden"
              aria-label={userPaused ? "Play photos" : "Pause photos"}
            >
              {userPaused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
