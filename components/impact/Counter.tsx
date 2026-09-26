"use client";

import { useEffect, useRef } from "react";

// Same curve as the site-wide motion ease, cubic-bezier(0.22, 1, 0.36, 1) ≈ easeOutQuint.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);
const DURATION = 1400;

/**
 * Counts up to `value` once it scrolls into view. Plain requestAnimationFrame rather than
 * motion's `animate`, which would pull the full animation engine into the initial bundle.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        el.textContent = `${Math.round(easeOut(t) * value)}${suffix}`;
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
