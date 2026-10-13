"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  Award,
  Building2,
} from "lucide-react";
import type { TRL } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TrlMeter } from "./TrlMeter";
import type { ResolvedStartup } from "./StartupShowcase";

type Scale = { level: TRL; label: string; phase: "Research" | "Development" | "Deployment" }[];

const FILTER_ALL = "All Ventures";
const FILTER_INCUBATED = "Incubated Startups";
const FILTER_PRE_INCUBATEE = "Pre-Incubatees";
const FILTER_PATENT_BACKED = "Patent-Backed";

export function StartupsDirectory({
  startups,
  scale,
  email,
}: {
  startups: ResolvedStartup[];
  scale: Scale;
  email: string;
}) {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);

  // Filter tab definitions with counts
  const filterDefinitions = useMemo(() => {
    return [
      {
        id: FILTER_ALL,
        label: FILTER_ALL,
        count: startups.length,
      },
      {
        id: FILTER_INCUBATED,
        label: FILTER_INCUBATED,
        count: startups.filter((s) => s.incubationStage === "Incubated").length,
      },
      {
        id: FILTER_PRE_INCUBATEE,
        label: FILTER_PRE_INCUBATEE,
        count: startups.filter((s) => s.incubationStage === "Pre-Incubatee").length,
      },
      {
        id: FILTER_PATENT_BACKED,
        label: FILTER_PATENT_BACKED,
        count: startups.filter((s) => s.associatedPatents && s.associatedPatents.length > 0).length,
      },
    ];
  }, [startups]);

  // Filtered and searched results
  const filtered = useMemo(() => {
    return startups.filter((s) => {
      // 1. Stage filter
      if (activeFilter === FILTER_INCUBATED && s.incubationStage !== "Incubated") return false;
      if (activeFilter === FILTER_PRE_INCUBATEE && s.incubationStage !== "Pre-Incubatee") return false;
      if (
        activeFilter === FILTER_PATENT_BACKED &&
        (!s.associatedPatents || s.associatedPatents.length === 0)
      ) {
        return false;
      }

      // 2. Search query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const inName = s.name.toLowerCase().includes(q);
      const inTagline = s.tagline.toLowerCase().includes(q);
      const inDesc = s.description.toLowerCase().includes(q);
      const inProblem = s.clinicalProblem ? s.clinicalProblem.toLowerCase().includes(q) : false;
      const inDomain = s.domainSpotlight ? s.domainSpotlight.toLowerCase().includes(q) : false;
      const inStudent = s.studentLead ? s.studentLead.toLowerCase().includes(q) : false;
      const inFaculty = s.facultyInvolved ? s.facultyInvolved.toLowerCase().includes(q) : false;
      const inFounders = s.founders.some((f) => f.name.toLowerCase().includes(q));
      const inPatents = s.associatedPatents
        ? s.associatedPatents.some((p) => p.toLowerCase().includes(q))
        : false;

      return (
        inName ||
        inTagline ||
        inDesc ||
        inProblem ||
        inDomain ||
        inStudent ||
        inFaculty ||
        inFounders ||
        inPatents
      );
    });
  }, [startups, activeFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== "" || activeFilter !== FILTER_ALL;

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter(FILTER_ALL);
  };

  return (
    <section id="directory" className="section-y border-b border-line bg-paper/40 scroll-mt-24">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <p className="eyebrow mb-2">Venture Registry</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            All documented ventures.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            Search and filter the complete roster of 10 healthcare technology spinouts incubated at IIT Jodhpur.
          </p>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor={searchInputId} className="sr-only">
              Search startups by venture name, technology, clinical problem, founder, mentor, or patent number
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
              <Search className="size-4" aria-hidden />
            </div>
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, technology, founder, scholar, patent number, or domain..."
              className="h-10 w-full rounded-md border border-line bg-white pl-10 pr-10 text-xs sm:text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-hidden transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search input"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-ink transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filterDefinitions.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-sm border px-3 text-xs transition-colors",
                    isSelected
                      ? "border-ink bg-ink text-white font-medium"
                      : "border-line bg-white text-ink-2 hover:border-line-strong hover:text-ink",
                  )}
                >
                  <span>{f.label}</span>
                  <span
                    className={cn(
                      "rounded-xs px-1.5 py-0.2 font-mono text-[0.66rem]",
                      isSelected ? "bg-white/20 text-white" : "bg-mist text-muted",
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary & Reset */}
          <div className="flex items-center justify-between border-b border-line pb-2.5 pt-0.5 text-xs text-muted">
            <p aria-live="polite">
              Showing <span className="font-mono font-medium text-ink">{filtered.length}</span> of{" "}
              <span className="font-mono text-ink">{startups.length}</span> ventures
              {activeFilter !== FILTER_ALL && (
                <span>
                  {" "}
                  in <span className="font-medium text-ink">{activeFilter}</span>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching &ldquo;<span className="text-ink">{searchQuery}</span>&rdquo;
                </span>
              )}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="font-mono text-xs text-blue hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Space-Efficient Registry Grid */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-8 text-center sm:p-12">
              <p className="font-medium text-ink text-base">No venture records match your query.</p>
              <p className="mt-1 text-xs text-muted">
                Try searching with different terms or selecting another category filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-sm border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-ink transition-colors"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {filtered.map((s) => {
                const isIncubated = s.incubationStage === "Incubated";
                const confirmedGrants = s.funding.filter((f) => f.kind !== "Incubation");

                return (
                  <article
                    key={s.id}
                    id={`directory-${s.id}`}
                    className="group rounded-lg border border-line bg-white p-5 transition-all hover:border-line-strong hover:shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Domain, Stage, Year */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2.5">
                        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-blue font-semibold">
                          {s.domainSpotlight || "Medical Technology"}
                        </span>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-xs border px-2 py-0.2 font-mono text-[0.62rem] uppercase tracking-wider font-medium",
                              isIncubated
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : "border-purple-300 bg-purple-50 text-purple-800",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                isIncubated ? "bg-emerald-600" : "bg-purple-600",
                              )}
                            />
                            {s.incubationStage}
                          </span>

                          {s.foundedYear && (
                            <span className="font-mono text-xs text-muted">
                              · {s.foundedYear}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <div className="mt-3">
                        <h3 className="text-base font-medium text-ink leading-snug">
                          <Link
                            href={`/startups/${s.slug}`}
                            className="hover:text-blue transition-colors"
                          >
                            {s.name}
                          </Link>
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-ink-2">
                          {s.tagline}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2">
                          {s.description}
                        </p>
                      </div>

                      {/* Compact TRL Meter */}
                      <div className="mt-3.5 border-t border-line/60 pt-2.5 flex items-center justify-between">
                        <span className="font-mono text-[0.68rem] text-muted">Readiness Level</span>
                        <TrlMeter trl={s.trl} scale={scale} compact />
                      </div>

                      {/* Patent & Funding Pills (Single line scannable) */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {s.associatedPatents && s.associatedPatents.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-xs border border-teal/30 bg-teal-soft/70 px-2 py-0.5 font-mono text-[0.66rem] text-teal-ink font-medium">
                            <ShieldCheck className="size-3" />
                            <span>{s.associatedPatents[0]}</span>
                            {s.associatedPatents.length > 1 && (
                              <span className="text-teal-700">+{s.associatedPatents.length - 1}</span>
                            )}
                          </span>
                        )}

                        {confirmedGrants.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-xs border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[0.66rem] text-emerald-800 font-medium">
                            <Award className="size-3 text-emerald-600" />
                            <span>{confirmedGrants[0].amount || confirmedGrants[0].source}</span>
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-xs border border-line bg-paper px-2 py-0.5 font-mono text-[0.66rem] text-muted">
                          <Building2 className="size-3" />
                          <span>{s.incubator ? "TISC Host" : "IIT Jodhpur"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs">
                      <span className="text-[0.72rem] text-muted font-mono truncate max-w-[200px]">
                        {s.studentLead ? s.studentLead.split("(")[0].trim() : s.facultyInvolved}
                      </span>

                      <Link
                        href={`/startups/${s.slug}`}
                        className="inline-flex items-center gap-1 font-medium text-blue hover:text-ink transition-colors shrink-0"
                      >
                        <span>View dossier</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer enquiry link */}
        <div className="mt-10 text-center text-xs text-muted">
          <span>Student or faculty founder with an innovative concept? </span>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent("Startup incubation enquiry")}`}
            className="text-blue hover:underline font-mono"
          >
            Enquire with TISC Incubation Desk
          </a>
        </div>
      </div>
    </section>
  );
}
