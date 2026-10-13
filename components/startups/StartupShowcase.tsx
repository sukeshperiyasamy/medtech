"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";
import type { Person, Startup, TRL } from "@/lib/types";
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
    <span
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist font-mono text-xs text-muted"
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function Profile({ s, scale }: { s: ResolvedStartup; scale: Scale }) {
  const isIncubated = s.incubationStage === "Incubated";

  return (
    <article
      aria-labelledby={`su-${s.id}`}
      className={cn(
        "border bg-white shadow-sm transition-all",
        s.provenance === "sample" ? "border-amber-400" : "border-line",
      )}
    >
      {s.provenance === "sample" && <DemoRibbon label="Demo content — not a real startup" />}

      {/* Team photograph or placeholder banner */}
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
          <div className="relative border-b border-line bg-gradient-to-br from-paper via-white to-mist/60 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  Centre for Medical Technologies · IIT Jodhpur
                </p>
                <p className="mt-1 font-mono text-xs text-blue">
                  {s.domainSpotlight || "Medical Deep-Tech Venture"}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium border",
                  isIncubated
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-purple-50 text-purple-800 border-purple-200",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isIncubated ? "bg-emerald-600" : "bg-purple-600",
                  )}
                />
                {s.incubationStage || "Incubated Venture"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Identity & Badges */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {s.logo ? (
              <Image
                src={s.logo.src}
                alt={s.logo.alt}
                width={56}
                height={56}
                className="size-14 border border-line object-contain p-1"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-line bg-mist font-mono text-sm font-semibold text-ink"
              >
                {s.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[0.7rem] font-medium border",
                    isIncubated
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-purple-50 text-purple-800 border-purple-200",
                  )}
                >
                  {s.incubationStage || "Incubated"}
                </span>
                {s.domainSpotlight && (
                  <span className="rounded-full bg-blue-soft px-2.5 py-0.5 font-mono text-[0.7rem] font-medium text-blue border border-blue/20">
                    {s.domainSpotlight}
                  </span>
                )}
              </div>
              <h3
                id={`su-${s.id}`}
                className="text-[1.8rem] font-medium leading-tight tracking-[-0.025em] text-ink"
              >
                {s.name}
              </h3>
              <p className="mt-1 text-ink-2 font-medium">{s.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {s.provenance === "sample" && <SampleBadge />}
            {s.areaTitle && <span className="eyebrow">{s.areaTitle}</span>}
          </div>
        </header>

        {/* Master Sheet Key Facts Table / Grid */}
        <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs font-mono uppercase text-muted">Incubation Stage</dt>
            <dd className="mt-1 font-medium text-ink">{s.incubationStage || "Incubated"}</dd>
          </div>
          <div>
            <dt className="text-xs font-mono uppercase text-muted">Agreement Date</dt>
            <dd className="mt-1 font-medium text-ink">
              {s.agreementDate
                ? new Date(s.agreementDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-mono uppercase text-muted">Incubator</dt>
            <dd className="mt-1 font-medium text-ink">{s.incubator || "IIT Jodhpur TISC"}</dd>
          </div>
          <div>
            <dt className="text-xs font-mono uppercase text-muted">Founded Year</dt>
            <dd className="mt-1 font-medium text-ink">{s.foundedYear || "—"}</dd>
          </div>
        </dl>

        {/* Student Lead & Faculty Highlights */}
        {(s.studentLead || s.facultyInvolved) && (
          <div className="mt-4 rounded-lg border border-line bg-paper p-4 text-xs sm:text-sm">
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              {s.studentLead && (
                <div>
                  <span className="font-mono text-xs uppercase text-muted block mb-0.5">
                    Student / Scholar Lead
                  </span>
                  <span className="font-medium text-ink">{s.studentLead}</span>
                </div>
              )}
              {s.facultyInvolved && (
                <div>
                  <span className="font-mono text-xs uppercase text-muted block mb-0.5">
                    IIT Jodhpur Faculty Involved
                  </span>
                  <span className="font-medium text-ink">
                    {s.facultyInvolved}{" "}
                    {s.facultyPosition && (
                      <span className="text-blue font-mono text-xs">({s.facultyPosition})</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Description from Sheet */}
        <p className="mt-6 text-base leading-relaxed text-ink-2">{s.description}</p>

        {/* Product + TRL + Associated Patents */}
        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-2 md:gap-10">
          <div>
            <p className="eyebrow mb-3">Core Innovation / Product</p>
            <div className="flex gap-4">
              <div className="w-24 sm:w-28 shrink-0">
                {s.product.image ? (
                  <Image
                    src={s.product.image.src}
                    alt={s.product.image.alt}
                    width={224}
                    height={224}
                    className="aspect-square w-full rounded-md object-cover border border-line"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="aspect-square w-full rounded-md bg-mist flex items-center justify-center border border-line"
                  >
                    <FileText className="size-6 text-muted" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-ink">{s.product.name}</p>
                <p className="mt-1 text-[0.93rem] text-muted leading-snug">
                  {s.product.description}
                </p>
              </div>
            </div>

            {/* Associated Patents from Master Sheet */}
            {s.associatedPatents && s.associatedPatents.length > 0 && (
              <div className="mt-6 rounded-md border border-teal/20 bg-teal-soft/60 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="size-4 text-teal-ink" />
                  <p className="font-mono text-xs uppercase tracking-wider font-medium text-teal-ink">
                    Associated Patent(s)
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.associatedPatents.map((pat) => (
                    <span
                      key={pat}
                      className="inline-flex items-center rounded border border-teal/30 bg-white px-2 py-0.5 font-mono text-xs font-medium text-teal-ink shadow-xs"
                    >
                      {pat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {s.clinicalProblem && (
              <>
                <p className="eyebrow mb-1.5 mt-6">Clinical Problem Addressed</p>
                <p className="text-[0.93rem] text-ink-2 leading-relaxed">{s.clinicalProblem}</p>
              </>
            )}
          </div>

          <div>
            <p className="eyebrow mb-3">Technology Readiness Level</p>
            <TrlMeter trl={s.trl} scale={scale} />
            {s.trlEvidence && (
              <div className="mt-4 rounded-md border border-line bg-mist/40 p-3">
                <p className="text-[0.88rem] text-ink-2 leading-relaxed">
                  <span className="font-medium text-ink">Readiness Evidence: </span>
                  {s.trlEvidence}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Team & Founding Agreements */}
        <div className="mt-10 grid gap-10 border-t border-line pt-8 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">Founders & Team</p>
            <ul className="space-y-4">
              {s.founders.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3">
                  {f.photo ? (
                    <Image
                      src={f.photo.src}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <Initials name={f.name} />
                  )}
                  <div className="leading-tight">
                    <p className="text-[0.95rem] font-medium text-ink">
                      {f.profileUrl ? (
                        <a
                          href={f.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-line"
                        >
                          {f.name}
                        </a>
                      ) : (
                        f.name
                      )}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {f.role}
                      {f.affiliation && ` · ${f.affiliation}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {s.mentors.length > 0 && (
              <p className="mt-5 text-sm text-muted">
                Faculty mentors:{" "}
                <span className="text-ink-2">{s.mentors.map((m) => m.name).join(", ")}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            {/* Confirmed Investments & Cash Grants */}
            {s.funding.some((f) => f.kind !== "Incubation") && (
              <div>
                <p className="eyebrow mb-3">Confirmed Capital & Grants</p>
                <ul className="border-t border-line divide-y divide-line">
                  {s.funding
                    .filter((f) => f.kind !== "Incubation")
                    .map((f, i) => (
                      <li
                        key={`${f.source}-${i}`}
                        className="py-3 flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                "rounded-xs px-1.5 py-0.2 font-mono text-[0.62rem] uppercase tracking-wider",
                                f.kind === "Seed investment"
                                  ? "border border-amber-300 bg-amber-soft text-amber-ink"
                                  : f.kind === "Grant"
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                                  : "border border-purple-200 bg-purple-50 text-purple-800",
                              )}
                            >
                              {f.kind}
                            </span>
                            {f.year && (
                              <span className="font-mono text-xs text-muted">
                                {f.year}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-ink leading-tight">{f.source}</p>
                          {f.programme && (
                            <p className="text-xs text-muted leading-tight">{f.programme}</p>
                          )}
                          {f.grantId && (
                            <div className="pt-0.5">
                              <Link
                                href={`/funding#${f.grantId}`}
                                className="inline-flex items-center gap-1 font-mono text-[0.68rem] text-blue hover:underline"
                              >
                                View in Funding Directory
                                <ArrowUpRight className="size-3" />
                              </Link>
                            </div>
                          )}
                        </div>

                        {f.amount && (
                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-semibold text-ink">
                              {f.amount}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Incubation Agreements & Status */}
            <div>
              <p className="eyebrow mb-3">Host Incubation Framework</p>
              <div className="rounded-md border border-line bg-paper/60 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Incubation Stage</span>
                  <span
                    className={cn(
                      "font-mono font-medium rounded-xs px-1.5 py-0.2 uppercase text-[0.65rem]",
                      s.incubationStage === "Incubated"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800",
                    )}
                  >
                    {s.incubationStage ?? "Incubated"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-line/60 pt-2">
                  <span className="text-muted">Host Incubator</span>
                  <span className="font-medium text-ink">
                    {s.incubator ?? "IIT Jodhpur TISC / Incubation Centre"}
                  </span>
                </div>

                {s.agreementDate && (
                  <div className="flex items-center justify-between border-t border-line/60 pt-2">
                    <span className="text-muted">Agreement Execution Date</span>
                    <span className="font-mono text-ink-2">{s.agreementDate}</span>
                  </div>
                )}

                {s.facultyPosition && (
                  <div className="flex items-center justify-between border-t border-line/60 pt-2">
                    <span className="text-muted">Faculty Position</span>
                    <span className="text-ink-2 font-medium">{s.facultyPosition}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {(s.website || s.links?.length) && (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
            {[...(s.website ? [{ label: "Website", url: s.website }] : []), ...(s.links ?? [])].map(
              (l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-blue"
                >
                  {l.label} <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function StartupShowcase({
  startups,
  scale,
  email,
}: {
  startups: ResolvedStartup[];
  scale: Scale;
  email: string;
}) {
  const [filter, setFilter] = useState<"all" | "Incubated" | "Pre-Incubatee">("all");
  const [activeId, setActiveId] = useState<string>(startups[0]?.id || "");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredStartups = useMemo(() => {
    if (filter === "all") return startups;
    return startups.filter((s) => s.incubationStage === filter);
  }, [startups, filter]);

  // If active startup is not in filtered list, pick first from filtered list
  const activeStartup = useMemo(() => {
    const found = filteredStartups.find((s) => s.id === activeId);
    return found || filteredStartups[0] || startups[0];
  }, [filteredStartups, activeId, startups]);

  const onKey = (e: React.KeyboardEvent, index: number) => {
    const n = filteredStartups.length;
    const map: Record<string, number> = {
      ArrowDown: (index + 1) % n,
      ArrowRight: (index + 1) % n,
      ArrowUp: (index - 1 + n) % n,
      ArrowLeft: (index - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const nextIndex = map[e.key];
    const target = filteredStartups[nextIndex];
    if (target) {
      setActiveId(target.id);
      tabs.current[nextIndex]?.focus();
    }
  };

  return (
    <MotionProvider>
      {/* Category / Stage Filter Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase text-muted mr-1">Filter by Stage:</span>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all border",
            filter === "all"
              ? "bg-ink text-white border-ink shadow-xs"
              : "bg-white text-ink-2 border-line hover:border-line-strong",
          )}
        >
          All Ventures ({startups.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("Incubated")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all border",
            filter === "Incubated"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
              : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50",
          )}
        >
          Incubated ({startups.filter((s) => s.incubationStage === "Incubated").length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("Pre-Incubatee")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-mono font-medium transition-all border",
            filter === "Pre-Incubatee"
              ? "bg-purple-700 text-white border-purple-700 shadow-xs"
              : "bg-white text-purple-800 border-purple-200 hover:bg-purple-50",
          )}
        >
          Pre-Incubatee ({startups.filter((s) => s.incubationStage === "Pre-Incubatee").length})
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Startup Selector Tabs */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div
              role="tablist"
              aria-label="Startups"
              className="-mx-5 flex overflow-x-auto px-5 sm:mx-0 sm:px-0 lg:flex-col lg:border-t lg:border-ink max-h-[calc(100vh-140px)] lg:overflow-y-auto"
            >
              {filteredStartups.map((st, i) => {
                const on = st.id === activeStartup.id;
                const isInc = st.incubationStage === "Incubated";

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
                    onClick={() => setActiveId(st.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cn(
                      "group relative min-w-[15rem] shrink-0 border-b py-3.5 pr-4 text-left transition-colors lg:min-w-0 lg:py-4.5",
                      on ? "border-blue lg:border-line bg-white/50 lg:bg-transparent" : "border-line",
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span className={cn("font-mono text-xs pt-0.5", on ? "text-blue font-semibold" : "text-muted")}>
                        {pad2(i + 1)}
                      </span>
                      <span className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.2 font-mono text-[0.65rem] font-medium border",
                              isInc
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-purple-50 text-purple-700 border-purple-200",
                            )}
                          >
                            {st.incubationStage || "Incubated"}
                          </span>
                          {st.domainSpotlight && (
                            <span className="text-[0.68rem] text-muted truncate max-w-[150px]">
                              {st.domainSpotlight}
                            </span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "block text-[1.1rem] font-medium leading-snug tracking-[-0.015em] transition-colors truncate",
                            on ? "text-ink" : "text-muted group-hover:text-ink",
                          )}
                        >
                          {st.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted line-clamp-1">
                          {st.tagline}
                        </span>
                        <span className="mt-2 block">
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

            <div className="mt-8 hidden border border-line bg-white p-5 lg:block shadow-xs rounded-sm">
              <p className="font-medium text-ink">Incubator Partner</p>
              <p className="mt-1 text-xs text-muted">
                Technology Innovation & Start-up Centre (TISC), IIT Jodhpur in partnership with AIIMS Jodhpur.
              </p>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("Startup incubation query")}`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue"
              >
                <span className="link-line">Contact Incubation Desk</span>
                <ArrowUpRight aria-hidden className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Startup Profile */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <m.div
              key={activeStartup.id}
              role="tabpanel"
              id={`su-panel-${activeStartup.id}`}
              aria-labelledby={`su-tab-${activeStartup.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Profile s={activeStartup} scale={scale} />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionProvider>
  );
}
