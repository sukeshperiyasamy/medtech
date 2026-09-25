"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, Search, X } from "lucide-react";
import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ProgramMeta {
  id: string;
  label: string;
  /** Programme-level context, e.g. that it is no longer offered. */
  note?: string;
}

const COLOR: Record<string, string> = {
  masters: "bg-blue",
  phd: "bg-cyan",
  "dual-degree": "bg-teal",
};

const INITIAL_YEARS = 2;

export function StudentRegister({
  students,
  programs,
  awards = {},
}: {
  students: Student[];
  programs: ProgramMeta[];
  /** studentId → award labels, linked to /achievements. */
  awards?: Record<string, string[]>;
}) {
  const [program, setProgram] = useState<string>("all");
  const [year, setYear] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const label = (id: string) => programs.find((p) => p.id === id)?.label ?? id;
  const years = useMemo(
    () => Array.from(new Set(students.map((s) => s.cohortYear))).sort((a, b) => b - a),
    [students],
  );

  // Intake by year, stacked by programme (always unfiltered — it's the overview).
  const intake = useMemo(
    () =>
      years.map((y) => ({
        year: y,
        parts: programs.map((p) => ({
          id: p.id,
          n: students.filter((s) => s.cohortYear === y && s.programId === p.id).length,
        })),
      })),
    [years, programs, students],
  );
  const maxIntake = Math.max(...intake.map((r) => r.parts.reduce((a, p) => a + p.n, 0)));

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return students.filter(
      (s) =>
        (program === "all" || s.programId === program) &&
        (year === null || s.cohortYear === year) &&
        (!term || s.name.toLowerCase().includes(term) || s.rollNumber.toLowerCase().includes(term)),
    );
  }, [students, program, year, q]);

  const groups = years
    .map((y) => ({ year: y, list: filtered.filter((s) => s.cohortYear === y) }))
    .filter((g) => g.list.length);
  const narrowed = Boolean(q.trim()) || year !== null;
  const visible = showAll || narrowed ? groups : groups.slice(0, INITIAL_YEARS);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Intake chart + filters */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow">Intake by year</p>
            {year !== null && (
              <button type="button" onClick={() => setYear(null)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
                <X aria-hidden className="size-3" /> Clear year
              </button>
            )}
          </div>
          <ul className="mt-4 space-y-2" aria-label="Students admitted per year — select a year to filter">
            {intake.map((r) => {
              const total = r.parts.reduce((a, p) => a + p.n, 0);
              const on = year === r.year;
              return (
                <li key={r.year}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setYear(on ? null : r.year)}
                    className={cn(
                      "group grid w-full grid-cols-[3rem_1fr_2rem] items-center gap-3 py-1 text-left transition-opacity",
                      year !== null && !on && "opacity-40 hover:opacity-80",
                    )}
                  >
                    <span className={cn("font-mono text-xs", on ? "text-ink" : "text-muted group-hover:text-ink")}>{r.year}</span>
                    <span className="flex h-3 overflow-hidden bg-mist" style={{ width: `${(total / maxIntake) * 100}%` }}>
                      {r.parts.map((p) =>
                        p.n ? (
                          <span key={p.id} className={COLOR[p.id]} style={{ width: `${(p.n / total) * 100}%` }} title={`${label(p.id)}: ${p.n}`} />
                        ) : null,
                      )}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums text-ink">{total}</span>
                    <span className="sr-only">
                      {r.parts.map((p) => `${label(p.id)} ${p.n}`).join(", ")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-hidden>
            {programs.map((p) => (
              <li key={p.id} className="flex items-center gap-1.5 text-xs text-muted">
                <span className={cn("size-2", COLOR[p.id])} />
                {p.label}
              </li>
            ))}
          </ul>
          {programs
            .filter((p) => p.note)
            .map((p) => (
              <p key={p.id} className="mt-3 text-xs leading-relaxed text-muted">
                {p.note}
              </p>
            ))}

          <label className="relative mt-10 block">
            <span className="sr-only">Search students by name or roll number</span>
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or roll number"
              className="h-10 w-full rounded-sm border border-line bg-white pl-9 pr-3 text-[0.9rem] text-ink placeholder:text-muted focus:border-blue focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-blue/20"
            />
          </label>
        </div>
      </div>

      {/* Register */}
      <div className="lg:col-span-8">
        <div role="group" aria-label="Filter by programme" className="-mx-5 flex gap-1 overflow-x-auto border-b border-ink px-5 pb-4 sm:mx-0 sm:px-0">
          {[{ id: "all", label: "All programmes" }, ...programs].map((p) => {
            const on = program === p.id;
            const n = p.id === "all" ? students.length : students.filter((s) => s.programId === p.id).length;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => setProgram(p.id)}
                className={cn("h-9 shrink-0 rounded-sm px-3 text-[0.87rem] transition-colors", on ? "bg-ink text-white" : "text-ink-2 hover:bg-mist")}
              >
                {p.label} <span className={cn("font-mono text-[0.7rem]", on ? "text-white/60" : "text-muted")}>{n}</span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">{filtered.length} students shown</p>

        {visible.map((g) => (
          <section key={g.year} aria-labelledby={`cohort-${g.year}`} className="grid gap-4 border-b border-line py-8 md:grid-cols-[8rem_1fr] md:gap-8">
            <header>
              <h3 id={`cohort-${g.year}`} className="text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-ink">
                {g.year}
              </h3>
              <p className="mt-2 font-mono text-xs text-muted">
                {g.list.length} {g.list.length === 1 ? "student" : "students"}
              </p>
            </header>
            <ul className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {g.list.map((s) => (
                <li key={s.id} className="flex items-start gap-3 border-t border-line py-3 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 xl:[&:nth-child(3)]:border-t-0">
                  <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", COLOR[s.programId])} />
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] leading-snug text-ink">{s.name}</span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] tracking-[0.04em] text-muted">
                      {s.rollNumber}
                      {program === "all" && <span className="font-sans"> · {label(s.programId)}</span>}
                    </span>
                    {awards[s.id]?.map((w) => (
                      <Link
                        key={w}
                        href="/achievements"
                        className="mt-1.5 inline-flex items-center gap-1 rounded-xs border border-blue/25 bg-blue-soft px-1.5 py-0.5 text-[0.72rem] text-blue hover:border-blue"
                      >
                        <Award aria-hidden className="size-3" />
                        {w}
                      </Link>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && <p className="py-10 text-muted">No students match your search.</p>}

        {!narrowed && groups.length > INITIAL_YEARS && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="mt-6 h-11 rounded-sm border border-line-strong px-5 text-[0.92rem] font-medium text-ink transition-colors hover:border-ink"
          >
            {showAll ? "Show recent cohorts only" : `Show all cohorts (${years[years.length - 1]}–${years[0]})`}
          </button>
        )}
      </div>
    </div>
  );
}
