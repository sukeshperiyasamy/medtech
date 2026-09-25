"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/lib/types";
import { cn, pad2 } from "@/lib/utils";

const TBC = <span className="text-muted">To be confirmed</span>;

export function ProgramTabs({ programs }: { programs: Program[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = programs[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = programs.length;
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const rows: { k: string; v: React.ReactNode }[] = [
    { k: "Eligibility", v: p.eligibility ?? TBC },
    { k: "Duration", v: p.duration ?? TBC },
    { k: "Curriculum", v: p.curriculum ?? TBC },
    { k: "Clinical exposure", v: p.clinicalExposure ?? TBC },
    { k: "Brochure", v: p.brochure ? <a className="link-line text-blue" href={p.brochure.url}>{p.brochure.label}</a> : TBC },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div role="tablist" aria-label="Programmes" aria-orientation="vertical" className="-mx-5 flex overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0 lg:col-span-4 lg:flex-col lg:border-b-0 lg:border-t">
        {programs.map((prog, i) => {
          const on = i === active;
          return (
            <button
              key={prog.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${prog.id}`}
              aria-selected={on}
              aria-controls={`panel-${prog.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "relative shrink-0 py-4 pr-6 text-left transition-colors lg:border-b lg:border-line lg:py-6",
                on ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span className="eyebrow block">{`${pad2(i + 1)} · ${prog.degree}`}</span>
              <span className="mt-1 block whitespace-nowrap text-[1.15rem] tracking-[-0.015em] lg:whitespace-normal lg:text-[1.45rem]">
                {prog.shortTitle}
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] bg-blue transition-all duration-500 ease-[var(--ease-precise)] lg:bottom-auto lg:top-0 lg:h-full lg:w-[2px] lg:-left-px",
                  on ? "w-full opacity-100 lg:w-[2px]" : "w-0 opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            role="tabpanel"
            id={`panel-${p.id}`}
            aria-labelledby={`tab-${p.id}`}
            tabIndex={0}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.35 }}
          >
            <h3 className="text-h3 text-ink">{p.title}</h3>
            <p className="text-lead mt-4 max-w-2xl text-ink-2">{p.overview}</p>

            <dl className="mt-10 border-t border-line">
              {rows.map((r) => (
                <div key={r.k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="eyebrow pt-1">{r.k}</dt>
                  <dd className="text-[0.97rem] text-ink-2">{r.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {p.admission?.map((l, i) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex h-11 items-center gap-2 rounded-sm px-4 text-[0.92rem] font-medium transition-colors",
                    i === 0 ? "bg-ink text-white hover:bg-blue" : "border border-line-strong text-ink hover:border-ink",
                  )}
                >
                  {l.label}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
              {p.cohortsUrl && (
                <a href={p.cohortsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-1.5 text-[0.92rem] text-ink-2 hover:text-ink">
                  <span className="link-line">Current & past cohorts</span>
                  <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
