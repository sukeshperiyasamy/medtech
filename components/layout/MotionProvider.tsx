"use client";

import { MotionConfig } from "motion/react";

/** Global motion defaults. `reducedMotion="user"` honours prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
