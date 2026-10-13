"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AchievementSlide {
  id: string;
  image: { src: string; alt: string; width: number; height: number };
  title?: string;
  shortTitle?: string;
  category?: string;
  awardedBy?: string;
  year?: number;
  date?: string;
  summary?: string;
  recipients?: { name: string }[];
}

export function AchievementsSlider({ items }: { items: AchievementSlide[] }) {
  // Requirement 1: Filter to show only verified landscape images (width > height)
  const landscapeItems = useMemo(() => {
    return items.filter(
      (item) =>
        item?.image?.src &&
        typeof item.image.width === "number" &&
        typeof item.image.height === "number" &&
        item.image.width > item.image.height,
    );
  }, [items]);

  const total = landscapeItems.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Touch gesture handling for tablet & mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const holding = userPaused || isHovered || isSwiping;

  // Safe active index after filtering
  const safeIndex = total > 0 ? ((currentIndex % total) + total) % total : 0;
  const currentSlide = landscapeItems[safeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (total <= 0) return;
      setCurrentIndex(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    goTo(safeIndex + 1);
  }, [safeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(safeIndex - 1);
  }, [safeIndex, goTo]);

  // Autoplay timer (5500ms)
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || holding || total <= 1) return;

    const timer = window.setInterval(() => {
      next();
    }, 5500);

    return () => window.clearInterval(timer);
  }, [next, holding, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === " " && document.activeElement === containerRef.current) {
        e.preventDefault();
        setUserPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  // Touch event handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Allow vertical scrolling naturally
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 15) {
      return;
    }

    setTouchDeltaX(deltaX);
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setTouchDeltaX(0);
    setIsSwiping(false);
  };

  // Requirement 4: Handle case where no landscape images remain gracefully
  if (total === 0 || !currentSlide) return null;

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="MedTech Milestones and Campus Highlights"
      aria-live="polite"
      className="w-full border-b border-line bg-paper/40 py-5 sm:py-8 lg:py-10 select-none focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container-x max-w-5xl mx-auto">
        {/* 1. Consistent Responsive Landscape Frame (16:9) with 1px solid #E2E8F0 border and light-neutral background */}
        <div
          className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-[#F8FAFC]"
          style={{ border: "1px solid #E2E8F0" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track - zero layout shift */}
          <div
            className={cn(
              "flex h-full w-full",
              isSwiping ? "transition-none" : "transition-transform duration-500 ease-out",
            )}
            style={{
              transform: `translateX(calc(-${safeIndex * 100}% + ${touchDeltaX}px))`,
            }}
          >
            {landscapeItems.map((item, i) => (
              <div
                key={item.id}
                className="relative h-full w-full shrink-0 flex items-center justify-center p-2 sm:p-3"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}: ${item.title || item.image.alt || "Photograph"}`}
                aria-hidden={i !== safeIndex}
              >
                {/* Complete photograph with object-contain: zero cropping, zero stretching */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    priority={i === 0 || i === 1}
                    sizes="(min-width: 1280px) 1024px, (min-width: 768px) 90vw, 100vw"
                    className="object-contain object-center select-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Side arrow buttons on desktop/tablet hover */}
          <div className="pointer-events-none absolute inset-y-0 inset-x-0 hidden sm:flex items-center justify-between px-3 z-10">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photograph"
              className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-ink shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-blue hover:scale-105 active:scale-95 opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photograph"
              className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-ink shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-blue hover:scale-105 active:scale-95 opacity-80 hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* 2. Captions & Slide Controls (Visually Separate from the Image Frame) */}
        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Left: Slide Caption & Category */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {currentSlide.category && (
              <span className="font-mono text-[0.68rem] font-medium uppercase tracking-wider px-2 py-0.5 rounded border border-line bg-mist text-ink-2 shrink-0">
                {currentSlide.category}
              </span>
            )}
            <p className="font-medium text-ink truncate text-xs sm:text-sm">
              {currentSlide.title || currentSlide.image.alt}
            </p>
          </div>

          {/* Right: Slide Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {/* Previous Button */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photograph"
              className="inline-flex size-8 items-center justify-center rounded border border-line bg-white text-ink transition-all hover:bg-mist hover:text-blue hover:border-line-strong active:scale-95"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Slide Counter */}
            <span className="font-mono text-xs font-medium text-ink px-1.5" aria-live="polite">
              {String(safeIndex + 1).padStart(2, "0")}
              <span className="text-muted font-normal"> / </span>
              {String(total).padStart(2, "0")}
            </span>

            {/* Next Button */}
            <button
              type="button"
              onClick={next}
              aria-label="Next photograph"
              className="inline-flex size-8 items-center justify-center rounded border border-line bg-white text-ink transition-all hover:bg-mist hover:text-blue hover:border-line-strong active:scale-95"
            >
              <ChevronRight className="size-4" />
            </button>

            {/* Indicators Bar (Pagination dots) */}
            <div
              className="hidden md:flex items-center gap-1.5 px-1"
              role="tablist"
              aria-label="Slide pagination"
            >
              {landscapeItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === safeIndex}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === safeIndex
                      ? "w-4 bg-blue shadow-xs"
                      : "w-1.5 bg-line-strong hover:bg-muted",
                  )}
                />
              ))}
            </div>

            {/* Autoplay Pause / Play Toggle */}
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              className="inline-flex size-8 items-center justify-center rounded border border-line bg-white text-ink transition-all hover:bg-mist hover:text-blue hover:border-line-strong motion-reduce:hidden"
            >
              {userPaused ? (
                <Play className="size-3.5 fill-current" />
              ) : (
                <Pause className="size-3.5 fill-current" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
