"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(112);

  // Touch gesture handling for tablet & mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const holding = userPaused || isHovered || isSwiping;

  // Measure dynamic header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      const announcement = document.querySelector(".bg-paper");
      let total = 0;
      if (announcement) {
        total += announcement.getBoundingClientRect().height;
      }
      if (header) {
        total += header.getBoundingClientRect().height;
      }
      if (total > 0) {
        setHeaderHeight(Math.round(total));
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  const total = items.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Autoplay timer
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || holding || total <= 1) return;

    const timer = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [currentIndex, holding, total, goTo]);

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

    // If scrolling vertically, let the page scroll naturally
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

  const scrollToContent = () => {
    const target = document.getElementById("home-content");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight - headerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="MedTech Milestones and Campus Highlights"
      aria-live="polite"
      className="group relative w-full overflow-hidden text-white select-none focus:outline-none"
      style={{
        height: `calc(100dvh - ${headerHeight}px)`,
        minHeight: "500px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding Track - 100% Full Bleed, Zero Black Bars */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${touchDeltaX}px))`,
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="relative h-full w-full shrink-0 overflow-hidden"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${item.title || "Photo"}`}
            aria-hidden={i !== currentIndex}
          >
            {/* The Photo fills 100% of the slide edge-to-edge */}
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              priority={i === 0 || i === 1}
              sizes="100vw"
              className="object-cover object-center w-full h-full"
            />

            {/* Edge-to-edge photo with zero dark shading or overlays */}
          </div>
        ))}
      </div>

      {/* Previous / Next Side Arrow Buttons */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-6 lg:px-8 z-20">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photograph"
          className="pointer-events-auto inline-flex size-9 sm:size-12 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-md"
        >
          <ChevronLeft aria-hidden className="size-4 sm:size-6" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photograph"
          className="pointer-events-auto inline-flex size-9 sm:size-12 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-md"
        >
          <ChevronRight aria-hidden className="size-4 sm:size-6" />
        </button>
      </div>

      {/* Bottom Center: "EXPLORE CENTRE" button (Desktop & Tablet) */}
      <div className="pointer-events-none absolute bottom-3 sm:bottom-4 inset-x-0 hidden md:flex justify-center z-20">
        <button
          type="button"
          onClick={scrollToContent}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-[0.72rem] font-mono tracking-wider text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-white shadow-md group/scroll"
          aria-label="Scroll down to main content"
        >
          <span>EXPLORE CENTRE</span>
          <ChevronDown className="size-3.5 transition-transform group-hover/scroll:translate-y-0.5" />
        </button>
      </div>

      {/* Bottom Right: Slide Counter, Indicators & Play/Pause */}
      <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-6 lg:right-8 z-30">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/30 p-1 sm:p-1.5 backdrop-blur-md shadow-md">
          {/* Slide Numbers */}
          <span className="px-1.5 sm:px-2 font-mono text-[0.7rem] sm:text-[0.75rem] text-white">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-white/50"> / </span>
            {String(total).padStart(2, "0")}
          </span>

          {/* Indicators Bar (on sm+ screens) */}
          <div className="hidden sm:flex items-center gap-1 px-1">
            {items.slice(0, 10).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-4 sm:w-5 bg-white shadow-sm"
                    : "w-1.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Autoplay Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            className="inline-flex size-6 sm:size-7 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 hover:text-white motion-reduce:hidden"
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {userPaused ? (
              <Play className="size-3 sm:size-3.5 fill-current" />
            ) : (
              <Pause className="size-3 sm:size-3.5 fill-current" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
