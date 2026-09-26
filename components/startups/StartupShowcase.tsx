"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ArrowUpRight } from "lucide-react";
import type { Person, Startup, TRL } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { DemoRibbon, SampleBadge } from "@/components/ui/SampleNote";
import { cn, pad2 } from "@/lib/utils";
import { TrlMeter } from "./TrlMeter";

export interface ResolvedStartup extends Startup {
  areaTitle?: string;
  mentors: Pick<Person, "id" | "name" | "designation">[];
}

type Scale = { level: TRL; label: string; phase: "Research" | "Development" | "Deployment" }[];

function Initials({ name }: { name: string }) {
  return (
    <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist font-mono text-xs text-muted">
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function Profile({ s, scale }: { s: ResolvedStartup; scale: Scale }) {
  return (
    <article aria-labelledby={`su-${s.id}`} className={cn("border bg-white", s.provenance === "sample" ? "border-amber-400" : "border-line")}>
      {s.provenance === "sample" && <DemoRibbon label="Demo content — not a real startup" />}
      {/* Team photograph */}
      <div className="relative">
        {s.teamPhoto ? (
          <Image
            src={s.teamPhoto.src}
            alt={s.teamPhoto.alt}
            width={1200}
            height={600}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="aspect-[2/1] w-full object-cover"
          />
        ) : (
          <ImagePlaceholder ratio="2 / 1" brief={`Team photograph — ${s.name} founders with their product`} />
        )}
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Identity */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {s.logo ? (
              <Image src={s.logo.src} alt={s.logo.alt} width={56} height={56} className="size-14 border border-line object-contain p-1" />
            ) : (
              <span aria-hidden className="flex size-14 items-center justify-center border border-dashed border-line-strong font-mono text-[0.6rem] uppercase text-muted">
                Logo
              </span>
            )}
            <div>
              <h3 id={`su-${s.id}`} className="text-[1.8rem] font-medium leading-tight tracking-[-0.025em] text-ink">
                {s.name}
              </h3>
              <p className="text-ink-2">{s.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {s.provenance === "sample" && <SampleBadge />}
            {s.areaTitle && <span className="eyebrow">{s.areaTitle}</span>}
          </div>
        </header>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted">Founded</dt>
            <dd className="text-ink">{s.foundedYear ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted">Incubator</dt>
            <dd className="text-ink">{s.incubator ?? "—"}</dd>
          </div>
        </dl>

        <p className="mt-6 max-w-2xl text-ink-2">{s.description}</p>

        {/* Product + TRL */}
        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow mb-3">Product</p>
            <div className="flex gap-4">
              <div className="w-28 shrink-0">
                {s.product.image ? (
                  <Image src={s.product.image.src} alt={s.product.image.alt} width={224} height={224} className="aspect-square w-full object-cover" />
                ) : (
                  <div aria-hidden className="aspect-square w-full bg-mist bg-grid-fine" />
                )}
              </div>
              <div>
                <p className="font-medium text-ink">{s.product.name}</p>
                <p className="mt-1 text-[0.93rem] text-muted">{s.product.description}</p>
              </div>
            </div>
            {s.clinicalProblem && (
              <>
                <p className="eyebrow mb-1.5 mt-6">Clinical problem</p>
                <p className="text-[0.93rem] text-ink-2">{s.clinicalProblem}</p>
              </>
            )}
          </div>
          <div>
            <p className="eyebrow mb-3">Technology readiness</p>
            <TrlMeter trl={s.trl} scale={scale} />
            {s.trlEvidence && <p className="mt-4 text-[0.88rem] text-muted">{s.trlEvidence}</p>}
          </div>
        </div>

        {/* Team + funding */}
        <div className="mt-10 grid gap-10 border-t border-line pt-8 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Team</p>
            <ul className="space-y-4">
              {s.founders.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3">
                  {f.photo ? (
                    <Image src={f.photo.src} alt="" width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <Initials name={f.name} />
                  )}
                  <div className="leading-tight">
                    <p className="text-[0.95rem] text-ink">
                      {f.profileUrl ? (
                        <a href={f.profileUrl} target="_blank" rel="noopener noreferrer" className="link-line">{f.name}</a>
                      ) : (
                        f.name
                      )}
                    </p>
                    <p className="text-xs text-muted">
                      {f.role}
                      {f.affiliation && ` · ${f.affiliation}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {s.mentors.length > 0 && (
              <p className="mt-5 text-sm text-muted">
                Faculty mentors: <span className="text-ink-2">{s.mentors.map((m) => m.name).join(", ")}</span>
              </p>
            )}
          </div>

          <div>
            <p className="eyebrow mb-4">Grants & funding received</p>
            {s.funding.length ? (
              <ul className="border-t border-line">
                {s.funding.map((f, i) => (
                  <li key={`${f.source}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-line py-3">
                    <div>
                      <p className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-teal-ink">{f.kind}</p>
                      <p className="mt-0.5 text-[0.95rem] text-ink">{f.source}</p>
                      {f.programme && <p className="text-xs text-muted">{f.programme}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-[0.95rem] text-ink">{f.amount ?? "—"}</p>
                      {f.year && <p className="font-mono text-xs text-muted">{f.year}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No funding recorded yet.</p>
            )}
          </div>
        </div>

        {(s.website || s.links?.length) && (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
            {[...(s.website ? [{ label: "Website", url: s.website }] : []), ...(s.links ?? [])].map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-blue">
                {l.label} <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function StartupShowcase({ startups, scale, email }: { startups: ResolvedStartup[]; scale: Scale; email: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = startups[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = startups.length;
    const map: Record<string, number> = {
      ArrowDown: (i + 1) % n,
      ArrowRight: (i + 1) % n,
      ArrowUp: (i - 1 + n) % n,
      ArrowLeft: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    setActive(map[e.key]);
    tabs.current[map[e.key]]?.focus();
  };

  return (
    <MotionProvider>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div role="tablist" aria-label="Startups" className="-mx-5 flex overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:flex-col lg:border-t lg:border-ink">
              {startups.map((st, i) => {
                const on = i === active;
                return (
                  <button
                    key={st.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`su-tab-${st.id}`}
                    aria-selected={on}
                    aria-controls={`su-panel-${st.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      "group relative min-w-[13rem] shrink-0 border-b py-4 pr-5 text-left transition-colors lg:min-w-0 lg:py-5",
                      on ? "border-blue lg:border-line" : "border-line",
                    )}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className={cn("font-mono text-xs", on ? "text-blue" : "text-muted")}>{pad2(i + 1)}</span>
                      <span className="flex-1">
                        <span className={cn("block text-[1.25rem] leading-tight tracking-[-0.02em] transition-colors", on ? "text-ink" : "text-muted group-hover:text-ink")}>
                          {st.name}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{st.tagline}</span>
                        <span className="mt-2.5 block">
                          <TrlMeter trl={st.trl} scale={scale} compact />
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-px top-0 hidden h-full w-[2px] bg-blue transition-opacity lg:block",
                        on ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 hidden border border-line bg-white p-5 lg:block">
              <p className="font-medium text-ink">Student founder?</p>
              <p className="mt-1 text-sm text-muted">
                Get your startup listed with its product, TRL, team and funding.
              </p>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Startup listing")}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue"
              >
                <span className="link-line">Submit your startup</span>
                <ArrowUpRight aria-hidden className="size-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <m.div
              key={s.id}
              role="tabpanel"
              id={`su-panel-${s.id}`}
              aria-labelledby={`su-tab-${s.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Profile s={s} scale={scale} />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionProvider>
  );
}
