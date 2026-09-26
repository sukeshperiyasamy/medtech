"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PipelineStage } from "@/lib/types";
import { cn, pad2 } from "@/lib/utils";

const ACCENT = { blue: "#2563eb", cyan: "#06b6d4", teal: "#14b8a6" } as const;
const ACCENT_TEXT = { blue: "text-blue", cyan: "text-cyan-ink", teal: "text-teal-ink" } as const;

/** Desktop: pinned panel whose content advances stage-by-stage with scroll. */
function StickyStory({ stages }: { stages: PipelineStage[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top+=72",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        if (fill.current) fill.current.style.transform = `scaleY(${p})`;
        setActive(Math.min(stages.length - 1, Math.floor(p * stages.length)));
      },
    });
    return () => st.kill();
  }, [stages.length]);

  const jump = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    const span = el.offsetHeight - (window.innerHeight - 72);
    window.scrollTo({ top: top + span * ((i + 0.5) / stages.length) });
  };

  const s = stages[active];
  return (
    <div ref={root} style={{ height: `${stages.length * 62}vh` }} className="relative">
      <div className="sticky top-[72px] flex h-[calc(100vh-72px)] items-center">
        <div className="container-x grid w-full grid-cols-12 gap-10">
          {/* Stage content */}
          <div className="col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <span className="eyebrow">Stage</span>
              <span className="font-mono text-sm text-ink">
                {pad2(active + 1)} <span className="text-muted">/ {pad2(stages.length)}</span>
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="relative mt-10 min-h-[22rem]">
              <AnimatePresence mode="wait">
                <m.div
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <p className={cn("eyebrow", ACCENT_TEXT[s.accent])}>{s.who}</p>
                  <h3 className="mt-4 text-[clamp(3rem,5.5vw,5rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-8 max-w-xl text-[1.5rem] leading-snug tracking-[-0.015em] text-ink-2">
                    {s.question}
                  </p>
                  <p className="mt-5 max-w-lg text-muted">{s.description}</p>
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Rail */}
          <nav aria-label="Pipeline stages" className="col-span-4 col-start-9 flex items-center">
            <div className="relative w-full py-2">
              <div aria-hidden className="absolute bottom-4 left-[7px] top-4 w-px bg-line" />
              <div
                ref={fill}
                aria-hidden
                className="absolute bottom-4 left-[7px] top-4 w-px origin-top bg-gradient-to-b from-blue via-cyan to-teal"
                style={{ transform: "scaleY(0)" }}
              />
              <ol className="relative flex flex-col gap-[clamp(0.7rem,2.2vh,1.5rem)]">
                {stages.map((st, i) => {
                  const done = i < active;
                  const on = i === active;
                  return (
                    <li key={st.id}>
                      <button
                        type="button"
                        onClick={() => jump(i)}
                        aria-current={on ? "step" : undefined}
                        className="group flex w-full items-center gap-5 text-left"
                      >
                        <span
                          aria-hidden
                          className="relative flex size-[15px] shrink-0 items-center justify-center rounded-full border bg-white transition-all duration-500"
                          style={{ borderColor: on || done ? ACCENT[st.accent] : "#cbd5e1" }}
                        >
                          <span
                            className="size-[7px] rounded-full transition-transform duration-500"
                            style={{ background: ACCENT[st.accent], transform: `scale(${on ? 1 : done ? 0.6 : 0})` }}
                          />
                        </span>
                        <span className="font-mono text-[0.7rem] text-muted">{pad2(i + 1)}</span>
                        <span
                          className={cn(
                            "text-[1.05rem] tracking-[-0.01em] transition-colors duration-300",
                            on ? "text-ink" : done ? "text-ink-2" : "text-muted group-hover:text-ink-2",
                          )}
                        >
                          {st.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

/** Mobile/tablet: full vertical timeline with a scroll-drawn line. */
function Timeline({ stages }: { stages: PipelineStage[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  return (
    <div className="container-x">
      <ol ref={ref} className="relative">
        <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
        <m.span
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-blue via-cyan to-teal"
          style={{ scaleY: scrollYProgress }}
        />
        {stages.map((s, i) => (
          <m.li
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 0.6 }}
            className="relative pb-10 pl-10 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border bg-white"
              style={{ borderColor: ACCENT[s.accent] }}
            >
              <span className="size-[7px] rounded-full" style={{ background: ACCENT[s.accent] }} />
            </span>
            <p className="font-mono text-[0.7rem] text-muted">
              {pad2(i + 1)} · <span className={ACCENT_TEXT[s.accent]}>{s.who}</span>
            </p>
            <h3 className="mt-1 text-2xl font-medium tracking-[-0.02em] text-ink">{s.title}</h3>
            <p className="mt-2 text-[1.05rem] text-ink-2">{s.question}</p>
            <p className="mt-2 text-[0.95rem] text-muted">{s.description}</p>
          </m.li>
        ))}
      </ol>
    </div>
  );
}

export function PipelineStory({ stages }: { stages: PipelineStage[] }) {
  return (
    <MotionProvider>
      <>
        <div className="hidden lg:block">
          <StickyStory stages={stages} />
        </div>
        <div className="lg:hidden">
          <Timeline stages={stages} />
        </div>
      </>
    </MotionProvider>
  );
}
