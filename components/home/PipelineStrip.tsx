"use client";

import { motion } from "motion/react";
import type { PipelineStage } from "@/lib/types";
import { pad2 } from "@/lib/utils";

const ACCENT = { blue: "#2563eb", cyan: "#06b6d4", teal: "#14b8a6" } as const;

/** Compact, single-row version of the Clinical Need → Impact model. */
export function PipelineStrip({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="relative">
      {/* Rule behind the nodes (desktop) */}
      <div aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block" />
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-gradient-to-r from-blue via-cyan to-teal lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      />
      <ol className="relative grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-5 lg:grid-cols-9 lg:gap-x-3">
        {stages.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
          >
            <span
              aria-hidden
              className="flex size-[15px] items-center justify-center rounded-full border bg-white"
              style={{ borderColor: ACCENT[s.accent] }}
            >
              <span className="size-[7px] rounded-full" style={{ background: ACCENT[s.accent] }} />
            </span>
            <p className="mt-4 font-mono text-[0.68rem] text-muted">{pad2(i + 1)}</p>
            <p className="mt-1 text-[1rem] leading-tight tracking-[-0.01em] text-ink">{s.title}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
