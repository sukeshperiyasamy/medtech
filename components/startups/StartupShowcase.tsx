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
        "rounded-xl border bg-white shadow-sm overflow-hidden transition-all",
        s.provenance === "sample" ? "border-amber-400" : "border-line",
      )}
    >
      {s.provenance === "sample" && <DemoRibbon label="Demo content — not a real startup" />}

      {/* Team photograph or placeholder banner */}
      <div className="relative">
        {s.teamPhoto ? (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-950 sm:aspect-[2.4/1]">
            <Image
              src={s.teamPhoto.src}
              alt={s.teamPhoto.alt}
              width={1400}
              height={600}
              priority
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
              <span className="text-xs font-mono tracking-wider opacity-90">
                {s.domainSpotlight || "Medical Deep-Tech Venture"}
              </span>
              <span className="text-xs font-mono bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {s.incubationStage || "Incubated Venture"}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative border-b border-line bg-gradient-to-br from-paper via-white to-mist/60 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  Centre for Medical Technologies · IIT Jodhpur & AIIMS Jodhpur
                </p>
                <p className="mt-1 font-mono text-xs font-semibold text-blue">
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

      <div className="p-6 sm:p-8 lg:p-10 space-y-10">
        {/* Identity & Badges */}
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {s.logo ? (
              <Image
                src={s.logo.src}
                alt={s.logo.alt}
                width={64}
                height={64}
                className="size-16 rounded-lg border border-line object-contain p-1.5 shadow-xs shrink-0"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-line bg-mist font-mono text-base font-semibold text-ink"
              >
                {s.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
                <span className="rounded-full bg-mist px-2.5 py-0.5 font-mono text-[0.7rem] text-muted border border-line">
                  TRL {s.trl} / 9
                </span>
              </div>
              <h1
                id={`su-${s.id}`}
                className="text-2xl sm:text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink"
              >
                {s.name}
              </h1>
              <p className="mt-1.5 text-base sm:text-lg text-ink-2 font-medium">{s.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {s.provenance === "sample" && <SampleBadge />}
            {s.areaTitle && <span className="eyebrow">{s.areaTitle}</span>}
          </div>
        </header>

        {/* Master Sheet Key Facts Grid */}
        <dl className="grid grid-cols-2 gap-4 border-y border-line py-5 text-sm sm:grid-cols-4 bg-paper/40 -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
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
          <div className="rounded-xl border border-line bg-paper/60 p-5 text-xs sm:text-sm">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
              {s.studentLead && (
                <div>
                  <span className="font-mono text-xs uppercase text-muted block mb-1">
                    Student / Scholar Lead
                  </span>
                  <span className="font-medium text-ink text-base">{s.studentLead}</span>
                </div>
              )}
              {s.facultyInvolved && (
                <div>
                  <span className="font-mono text-xs uppercase text-muted block mb-1">
                    IIT Jodhpur Faculty Involved
                  </span>
                  <span className="font-medium text-ink text-base">
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

        {/* Section 1: Innovation Overview & Clinical Problem */}
        <section className="space-y-6">
          <div>
            <h2 className="eyebrow mb-2">01 · Innovation & Clinical Rationale</h2>
            <p className="text-base leading-relaxed text-ink-2">{s.description}</p>
          </div>

          {/* Clinical Need Callout */}
          {s.clinicalProblem && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-amber-500" />
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-amber-900">
                  Unmet Clinical Need & Medical Challenge
                </h3>
              </div>
              <p className="text-[0.93rem] text-amber-950 leading-relaxed font-normal">
                {s.clinicalProblem}
              </p>
            </div>
          )}
        </section>

        {/* Section 2: Core Engineering & Product Architecture */}
        <section className="border-t border-line pt-8 space-y-6">
          <h2 className="eyebrow">02 · Engineering Architecture & Product Specification</h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start rounded-xl border border-line bg-paper/30 p-5">
            <div className="w-24 sm:w-28 shrink-0">
              {s.product.image ? (
                <Image
                  src={s.product.image.src}
                  alt={s.product.image.alt}
                  width={224}
                  height={224}
                  className="aspect-square w-full rounded-lg object-cover border border-line shadow-xs"
                />
              ) : (
                <div
                  aria-hidden
                  className="aspect-square w-full rounded-lg bg-mist flex items-center justify-center border border-line"
                >
                  <FileText className="size-8 text-muted" />
                </div>
              )}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue uppercase tracking-wider">
                  Engineered Device / System
                </span>
              </div>
              <h3 className="text-lg font-medium text-ink">{s.product.name}</h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                {s.product.description}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Technology Readiness Level & Evidence */}
        <section className="border-t border-line pt-8 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="eyebrow">03 · Technology Readiness Level (TRL)</h2>
            <span className="font-mono text-xs text-muted">Scale 1 (Basic Principle) to 9 (Operational)</span>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-xs space-y-5">
            <TrlMeter trl={s.trl} scale={scale} />

            {s.trlEvidence && (
              <div className="rounded-lg border border-line bg-mist/40 p-4">
                <p className="text-xs font-mono uppercase tracking-wider text-muted mb-1 font-semibold">
                  Validation & Readiness Evidence
                </p>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {s.trlEvidence}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Intellectual Property & Patent Applications */}
        <section className="border-t border-line pt-8 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="eyebrow">04 · Intellectual Property & Patent Portfolio</h2>
            <span className="font-mono text-[0.68rem] text-muted uppercase">Indian Patent Office (IPO)</span>
          </div>

          <div className="rounded-xl border border-teal/25 bg-teal-soft/30 p-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="size-5 text-teal-ink shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-ink">
                  Patent Applications Filed (Awaiting Examination)
                </p>
                <p className="text-xs text-ink-2 mt-0.5">
                  Official patent applications filed with the Indian Patent Office (IPO). These represent formally submitted intellectual property awaiting publication or examination, not yet granted patents.
                </p>
              </div>
            </div>

            {s.associatedPatents && s.associatedPatents.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-teal/20">
                {s.associatedPatents.map((pat) => (
                  <span
                    key={pat}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-teal/30 bg-white px-3 py-1.5 font-mono text-xs font-medium text-teal-ink shadow-xs"
                  >
                    <FileText className="size-3.5 text-teal-ink/70" />
                    {pat}
                    <span className="rounded bg-teal-soft px-1.5 py-0.2 text-[0.65rem] font-semibold text-teal-ink">
                      Application Filed
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <div className="pt-2 border-t border-teal/20 text-xs text-ink-2">
                <p>Pre-filing laboratory documentation or IP disclosure under review with the IIT Jodhpur IPR Cell.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Funding Awards & Incubation Framework */}
        <section className="border-t border-line pt-8 space-y-6">
          <h2 className="eyebrow">05 · Financial Capital & Incubation Framework</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Confirmed External Capital & Grants */}
            <div className="rounded-xl border border-line bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink">
                  Confirmed Capital & Cash Grants
                </h3>
                <span className="font-mono text-[0.65rem] text-muted">Audited Records</span>
              </div>

              {s.funding.some((f) => f.kind !== "Incubation") ? (
                <ul className="divide-y divide-line">
                  {s.funding
                    .filter((f) => f.kind !== "Incubation")
                    .map((f, i) => (
                      <li
                        key={`${f.source}-${i}`}
                        className="py-3 flex items-start justify-between gap-3 text-sm first:pt-0 last:pb-0"
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
              ) : (
                <p className="text-xs text-muted py-3">
                  Pre-capital R&D stage. Current operational support provided through institutional incubation and laboratory access agreements.
                </p>
              )}
            </div>

            {/* Right: Host Incubation Framework */}
            <div className="rounded-xl border border-line bg-paper/60 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-ink">
                  Host Incubation Framework
                </h3>
                <span className="font-mono text-[0.65rem] text-muted">TISC Partner</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Incubation Stage</span>
                  <span
                    className={cn(
                      "font-mono font-medium rounded-xs px-2 py-0.5 uppercase text-[0.68rem]",
                      s.incubationStage === "Incubated"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800",
                    )}
                  >
                    {s.incubationStage ?? "Incubated"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
                  <span className="text-muted">Host Incubator</span>
                  <span className="font-medium text-ink">
                    {s.incubator ?? "IIT Jodhpur TISC / Incubation Centre"}
                  </span>
                </div>

                {s.agreementDate && (
                  <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
                    <span className="text-muted">Agreement Execution Date</span>
                    <span className="font-mono text-ink font-medium">
                      {new Date(s.agreementDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {s.facultyPosition && (
                  <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
                    <span className="text-muted">Faculty Position</span>
                    <span className="text-ink font-medium">{s.facultyPosition}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Founders & Mentorship */}
        <section className="border-t border-line pt-8 space-y-6">
          <h2 className="eyebrow">06 · Founders & Academic Mentors</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {s.founders.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="flex items-start gap-3.5 rounded-xl border border-line bg-paper/40 p-4"
              >
                {f.photo ? (
                  <Image
                    src={f.photo.src}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover border border-line shadow-xs"
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
                  <p className="text-xs text-muted mt-1 leading-snug">
                    {f.role}
                    {f.affiliation && ` · ${f.affiliation}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {s.mentors.length > 0 && (
            <div className="rounded-xl border border-line bg-white p-4.5 text-sm">
              <span className="font-mono text-xs uppercase text-muted block mb-1">
                Faculty Mentorship (IIT Jodhpur / AIIMS Jodhpur)
              </span>
              <p className="text-ink font-medium">
                {s.mentors.map((m) => `${m.name} (${m.designation})`).join("; ")}
              </p>
            </div>
          )}
        </section>

        {/* Section 7: External Verification & Web Links */}
        {(s.website || s.links?.length || s.sourceUrl) && (
          <section className="border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                ...(s.website ? [{ label: "Official Venture Website", url: s.website }] : []),
                ...(s.sourceUrl ? [{ label: "TISC Incubation Record", url: s.sourceUrl }] : []),
                ...(s.links ?? []),
              ].map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue hover:underline"
                >
                  {l.label} <ArrowUpRight aria-hidden className="size-3" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>

            <p className="text-[0.68rem] font-mono text-muted">
              Source: Centre for Medical Technologies Master Records (Sep 2026)
            </p>
          </section>
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
