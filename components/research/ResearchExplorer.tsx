"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ArrowRight, Plus } from "lucide-react";
import type { Person, ResearchArea } from "@/lib/types";
import { cn, pad2, isIitjHosted } from "@/lib/utils";

export interface ResolvedArea extends ResearchArea {
  faculty: Pick<Person, "id" | "name" | "designation" | "photo">[];
}

function FacultyList({ faculty }: { faculty: ResolvedArea["faculty"] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {faculty.map((f) => (
        <li key={f.id} className="flex items-center gap-3">
          {f.photo ? (
            <Image
              src={f.photo.src}
              unoptimized={isIitjHosted(f.photo.src)}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-cover grayscale-[35%]"
            />
          ) : (
            <span className="size-10 shrink-0 rounded-full bg-mist" />
          )}
          <span className="leading-tight">
            <span className="block text-[0.92rem] text-ink">{f.name}</span>
            <span className="block text-xs text-muted">{f.designation}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ResearchExplorer({ areas }: { areas: ResolvedArea[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const a = areas[active];

  // Deep links such as /research#imaging-ai open that theme.
  useEffect(() => {
    const sync = () => {
      const i = areas.findIndex((x) => x.id === window.location.hash.slice(1));
      if (i < 0) return;
      setActive(i);
      setOpenMobile(i);
      document.getElementById("research")?.scrollIntoView({ block: "start" });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [areas]);

  return (
    <MotionProvider>
      <>
        {/* Desktop: feature panel + index */}
        <div className="hidden gap-10 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="sticky top-28 min-h-[34rem] border border-line bg-white">
              <AnimatePresence mode="wait">
                <m.article
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full flex-col"
                  aria-live="polite"
                >
                  <div className="relative overflow-hidden border-b border-line bg-paper bg-grid px-8 pb-8 pt-7">
                    <div className="flex items-start justify-between">
                      <p className="eyebrow">Research theme</p>
                      <p className="font-mono text-[4.5rem] leading-none tracking-[-0.04em] text-line-strong">
                        {pad2(active + 1)}
                      </p>
                    </div>
                    <h3 className="mt-2 max-w-[18ch] text-[2.1rem] font-medium leading-[1.1] tracking-[-0.025em] text-ink">
                      {a.title}
                    </h3>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {a.keywords.map((k) => (
                        <li
                          key={k}
                          className="rounded-xs border border-line bg-white px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-ink-2"
                        >
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 py-8">
                    <p className="text-lead text-ink-2">{a.summary}</p>
                    <p className="eyebrow mb-4 mt-10">Faculty working in this theme</p>
                    <FacultyList faculty={a.faculty} />
                  </div>
                </m.article>
              </AnimatePresence>
            </div>
          </div>

          <ol className="lg:col-span-5 border-t border-line" aria-label="Research themes">
            {areas.map((area, i) => {
              const isActive = i === active;
              return (
                <li key={area.id} className="border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group flex w-full items-center gap-5 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "font-mono text-xs transition-colors",
                        isActive ? "text-blue" : "text-muted",
                      )}
                    >
                      {pad2(i + 1)}
                    </span>
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block text-[1.35rem] leading-tight tracking-[-0.02em] transition-colors duration-300",
                          isActive ? "text-ink" : "text-muted group-hover:text-ink",
                        )}
                      >
                        {area.shortTitle}
                      </span>
                      <span className="mt-1 block font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
                        {area.faculty.length} faculty
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={cn(
                        "size-5 transition-all duration-500 ease-[var(--ease-precise)]",
                        isActive ? "translate-x-0 text-blue opacity-100" : "-translate-x-2 opacity-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile & tablet: accordion */}
        <ol className="border-t border-line lg:hidden" aria-label="Research themes">
          {areas.map((area, i) => {
            const open = openMobile === i;
            return (
              <li key={area.id} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`rt-${area.id}`}
                    onClick={() => setOpenMobile(open ? null : i)}
                    className="flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className="font-mono text-xs text-blue">{pad2(i + 1)}</span>
                    <span className="flex-1 text-[1.2rem] leading-tight tracking-[-0.015em] text-ink">
                      {area.title}
                    </span>
                    <Plus
                      aria-hidden
                      className={cn(
                        "size-5 text-muted transition-transform duration-300",
                        open && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <m.div
                      id={`rt-${area.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pl-8">
                        <p className="text-ink-2">{area.summary}</p>
                        <p className="eyebrow mb-3 mt-6">Faculty</p>
                        <FacultyList faculty={area.faculty} />
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </>
    </MotionProvider>
  );
}
