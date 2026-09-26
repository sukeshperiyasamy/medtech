"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ArrowUpRight } from "lucide-react";
import type { Grant, GrantCategory } from "@/lib/types";
import { SampleBadge } from "@/components/ui/SampleNote";
import { cn } from "@/lib/utils";

const ALL = "All";

function StatusPill({ status }: { status: Grant["grantStatus"] }) {
  const tone: Record<Grant["grantStatus"], string> = {
    Open: "text-teal-ink border-teal/40 bg-teal-soft",
    Rolling: "text-cyan-ink border-cyan/40 bg-cyan-soft",
    Upcoming: "text-blue border-blue/30 bg-blue-soft",
    Closed: "text-muted border-line bg-paper",
    Unverified: "text-amber-ink border-amber-300/70 bg-amber-soft",
  };
  return (
    <span className={cn("inline-flex rounded-xs border px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.06em]", tone[status])}>
      {status}
    </span>
  );
}

export function FundingExplorer({ grants, categories }: { grants: Grant[]; categories: GrantCategory[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const rows = useMemo(
    () => (filter === ALL ? grants : grants.filter((g) => g.categories.includes(filter as GrantCategory))),
    [filter, grants],
  );

  return (
    <MotionProvider>
      <div>
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[ALL, ...categories].map((c) => {
            const on = c === filter;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={cn(
                  "h-9 shrink-0 whitespace-nowrap rounded-sm border px-3.5 text-[0.85rem] transition-colors duration-200",
                  on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-2 hover:border-line-strong hover:text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {rows.length} funding {rows.length === 1 ? "listing" : "listings"} shown
        </p>

        {/* Table (md+) */}
        <div className="mt-6 hidden border-t border-ink md:block">
          <table className="w-full text-left text-[0.93rem]">
            <caption className="sr-only">Funding opportunities</caption>
            <thead>
              <tr className="border-b border-line">
                {["Programme", "Research area", "Eligibility", "Amount", "Deadline", "Status", ""].map((h) => (
                  <th key={h} scope="col" className="eyebrow py-3.5 pr-4 font-normal">
                    {h || <span className="sr-only">Link</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((g) => (
                  <m.tr
                    key={g.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group border-b border-line align-top transition-colors hover:bg-paper"
                  >
                    <th scope="row" className="py-5 pr-4 font-normal">
                      <span className="block font-mono text-[0.7rem] uppercase tracking-[0.08em] text-blue">{g.agency}</span>
                      <span className="mt-1 block text-[1.02rem] font-medium text-ink">{g.name}</span>
                      {g.provenance === "sample" && <SampleBadge className="mt-2" />}
                    </th>
                    <td className="py-5 pr-4 text-ink-2">{g.researchArea}</td>
                    <td className="max-w-[16rem] py-5 pr-4 text-muted">{g.eligibility}</td>
                    <td className="py-5 pr-4 text-ink-2">{g.amount ?? "—"}</td>
                    <td className="py-5 pr-4 text-ink-2">{g.deadline ?? "—"}</td>
                    <td className="py-5 pr-4"><StatusPill status={g.grantStatus} /></td>
                    <td className="py-5 text-right">
                      <a
                        href={g.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors group-hover:border-ink"
                      >
                        <ArrowUpRight className="size-4" aria-hidden />
                        <span className="sr-only">Official page for {g.name} (opens in a new tab)</span>
                      </a>
                    </td>
                  </m.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Stacked list (mobile) */}
        <ul className="mt-6 border-t border-ink md:hidden">
          {rows.map((g) => (
            <li key={g.id} className="border-b border-line py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-blue">{g.agency}</p>
                  <p className="mt-1 text-[1.05rem] font-medium text-ink">{g.name}</p>
                </div>
                <StatusPill status={g.grantStatus} />
              </div>
              <dl className="mt-3 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted">Area</dt>
                <dd className="text-ink-2">{g.researchArea}</dd>
                <dt className="text-muted">Eligibility</dt>
                <dd className="text-ink-2">{g.eligibility}</dd>
                <dt className="text-muted">Deadline</dt>
                <dd className="text-ink-2">{g.deadline ?? "—"}</dd>
              </dl>
              <div className="mt-3 flex items-center justify-between">
                {g.provenance === "sample" ? <SampleBadge /> : <span />}
                <a href={g.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-ink">
                  Official page <ArrowUpRight className="size-3.5" aria-hidden />
                  <span className="sr-only">for {g.name} (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MotionProvider>
  );
}
