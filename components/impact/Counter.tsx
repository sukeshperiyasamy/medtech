"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const reduce = useReducedMotion();
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || hasAnimated.current) return;

    if (inView) {
      hasAnimated.current = true;
      const controls = animate(0, value, {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => {
          if (el) el.textContent = `${Math.round(v)}${suffix}`;
        },
      });
      return () => controls.stop();
    }
  }, [inView, value, suffix, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
