"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface AchievementSlide {
  id: string;
  title: string;
  category: string;
  year: number;
  recipients: string;
  image: { src: string; alt: string; width: number; height: number };
}

const GAP = 16;

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
      className="border-b border-line bg-paper"
      onMouseEnter={() => setEngaged(true)}
      onMouseLeave={() => setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setEngaged(false);
      }}
    >
      <div className="container-x flex flex-wrap items-center justify-between gap-3 pt-5">
        <p className="eyebrow">Achievements</p>
        <div className="flex items-center gap-2">
          <Link prefetch={false} href="/achievements" className="link-line mr-2 text-[0.92rem] font-medium text-ink hover:text-blue">
            All achievements
          </Link>
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink"
            aria-label="Previous achievement"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink"
            aria-label="Next achievement"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors hover:border-ink motion-reduce:hidden"
            aria-label={userPaused ? "Play achievements" : "Pause achievements"}
          >
            {userPaused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        className="container-x flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li
            key={item.id}
            className="w-[min(82vw,20.5rem)] shrink-0 snap-start"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <Link
              prefetch={false}
              href={`/achievements#ach-title-${item.id}`}
              className="group block overflow-hidden border border-line bg-white"
            >
              <div className="overflow-hidden bg-mist">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(min-width: 1024px) 328px, 82vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-precise)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-4 py-3.5">
                <p className="flex items-center gap-2">
                  <span className="eyebrow !text-blue">{item.category}</span>
                  <span className="eyebrow">{item.year}</span>
                </p>
                <p className="mt-2 line-clamp-2 text-[1.05rem] font-medium leading-snug tracking-[-0.02em] text-ink group-hover:text-blue">
                  {item.title}
                </p>
                {item.recipients && (
                  <p className="mt-1.5 line-clamp-1 text-sm text-muted">{item.recipients}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
