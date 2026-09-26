"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Animation features load in a separate chunk after first render (see lib/motion-features).
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Global motion defaults. `reducedMotion="user"` honours prefers-reduced-motion.
 * LazyMotion keeps the animation engine out of the initial bundle; `strict` fails loudly
 * if a component uses the full `motion.*` API instead of the lightweight `m.*` one.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
