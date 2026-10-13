"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Search,
  X,
  ChevronDown,
  ArrowUpRight,
  Award,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import type { Grant } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTER_ALL = "All Records";
const FILTER_SECURED = "Secured Grants & Seed";
const FILTER_VENTURE = "Venture & Seed Capital";
const FILTER_GOVERNMENT = "Government Schemes";
const FILTER_BIOTECH = "Biotechnology & Health";
const FILTER_FELLOWSHIPS = "Fellowships & Selections";
const FILTER_OPEN = "Open Application Pathways";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function StatusPill({ status }: { status: Grant["grantStatus"] }) {
  const tone: Record<Grant["grantStatus"], string> = {
    Awarded: "text-emerald-800 border-emerald-300/80 bg-emerald-50/80 font-medium",
    Open: "text-teal-ink border-teal/40 bg-teal-soft font-medium",
    Rolling: "text-cyan-ink border-cyan/40 bg-cyan-soft font-medium",
    Upcoming: "text-blue border-blue/30 bg-blue-soft",
    Closed: "text-muted border-line bg-paper",
    Unverified: "text-amber-ink border-amber-300/70 bg-amber-soft",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.06em]",
        tone[status],
      )}
    >
      {status === "Awarded" && <CheckCircle2 className="size-3 text-emerald-600" />}
      {status}
    </span>
  );
}

export function FundingExplorer({ grants }: { grants: Grant[] }) {
  const searchInputId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL);

  // Filter definitions and counts
  const filterDefinitions = useMemo(() => {
    return [
      {
        id: FILTER_ALL,
        label: FILTER_ALL,
        count: grants.length,
      },
      {
        id: FILTER_SECURED,
        label: FILTER_SECURED,
        count: grants.filter((g) => g.grantStatus === "Awarded").length,
      },
      {
        id: FILTER_VENTURE,
        label: FILTER_VENTURE,
        count: grants.filter(
          (g) => g.grantKind === "Seed Funding" || g.categories.includes("Startup"),
        ).length,
      },
      {
        id: FILTER_GOVERNMENT,
        label: FILTER_GOVERNMENT,
        count: grants.filter((g) => g.categories.includes("Government")).length,
      },
      {
        id: FILTER_BIOTECH,
        label: FILTER_BIOTECH,
        count: grants.filter((g) => g.categories.includes("Biotechnology")).length,
      },
      {
        id: FILTER_FELLOWSHIPS,
        label: FILTER_FELLOWSHIPS,
        count: grants.filter(
          (g) =>
            g.grantKind === "Fellowship" ||
            g.categories.includes("International") ||
            g.name.toLowerCase().includes("fellowship"),
        ).length,
      },
      {
        id: FILTER_OPEN,
        label: FILTER_OPEN,
        count: grants.filter((g) => g.grantStatus !== "Awarded").length,
      },
    ].filter((f) => f.count > 0);
  }, [grants]);

  // Filter and search computation
  const filteredGrants = useMemo(() => {
    return grants.filter((g) => {
      // 1. Category Filter Match
      let matchesFilter = true;
      if (activeFilter === FILTER_SECURED) {
        matchesFilter = g.grantStatus === "Awarded";
      } else if (activeFilter === FILTER_VENTURE) {
        matchesFilter =
          g.grantKind === "Seed Funding" || g.categories.includes("Startup");
      } else if (activeFilter === FILTER_GOVERNMENT) {
        matchesFilter = g.categories.includes("Government");
      } else if (activeFilter === FILTER_BIOTECH) {
        matchesFilter = g.categories.includes("Biotechnology");
      } else if (activeFilter === FILTER_FELLOWSHIPS) {
        matchesFilter =
          g.grantKind === "Fellowship" ||
          g.categories.includes("International") ||
          g.name.toLowerCase().includes("fellowship");
      } else if (activeFilter === FILTER_OPEN) {
        matchesFilter = g.grantStatus !== "Awarded";
      }

      if (!matchesFilter) return false;

      // 2. Search Query Match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      return (
        g.name.toLowerCase().includes(q) ||
        g.agency.toLowerCase().includes(q) ||
        g.researchArea.toLowerCase().includes(q) ||
        (g.beneficiary && g.beneficiary.toLowerCase().includes(q)) ||
        (g.recipientRoll && g.recipientRoll.toLowerCase().includes(q)) ||
        (g.facultyMentor && g.facultyMentor.toLowerCase().includes(q)) ||
        (g.associatedStartup && g.associatedStartup.toLowerCase().includes(q)) ||
        (g.associatedPatent && g.associatedPatent.toLowerCase().includes(q)) ||
        (g.amount && g.amount.toLowerCase().includes(q)) ||
        (g.eligibility && g.eligibility.toLowerCase().includes(q))
      );
    });
  }, [grants, activeFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== "" || activeFilter !== FILTER_ALL;

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter(FILTER_ALL);
  };

  // Spotlight state
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [activeSpotlightId, setActiveSpotlightId] = useState<string | null>(null);
  const [hoveredSpotlightId, setHoveredSpotlightId] = useState<string | null>(null);

  const activeSpotlightIdRef = useRef<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Compute the first 10 eligible records based on current filtered/searched results
  const first10Grants = useMemo(() => {
    return filteredGrants.slice(0, 10);
  }, [filteredGrants]);

  const spotlightIdSet = useMemo(() => {
    return new Set(first10Grants.map((g) => g.id));
  }, [first10Grants]);

  // Observer and RAF-throttled scroll detection
  const updateSpotlight = useCallback(() => {
    if (isReducedMotion || first10Grants.length === 0) {
      if (activeSpotlightIdRef.current !== null) {
        activeSpotlightIdRef.current = null;
        setActiveSpotlightId(null);
      }
      return;
    }

    const vh = window.innerHeight;
    // Central viewport focus zone
    const focusTop = vh * 0.16;
    const focusBottom = vh * 0.80;
    const focusCenter = vh * 0.48;

    const firstCard = first10Grants[0];
    const lastCard = first10Grants[first10Grants.length - 1];

    const firstEl = cardRefs.current.get(firstCard.id);
    const lastEl = cardRefs.current.get(lastCard.id);

    if (!firstEl || !lastEl) {
      if (activeSpotlightIdRef.current !== null) {
        activeSpotlightIdRef.current = null;
        setActiveSpotlightId(null);
      }
      return;
    }

    const firstRect = firstEl.getBoundingClientRect();
    const lastRect = lastEl.getBoundingClientRect();

    const firstCenter = firstRect.top + firstRect.height / 2;
    const lastCenter = lastRect.top + lastRect.height / 2;

    // 1. Before the first spotlight record enters the focus zone:
    // keep records in their normal appearance
    if (firstCenter > focusBottom) {
      if (activeSpotlightIdRef.current !== null) {
        activeSpotlightIdRef.current = null;
        setActiveSpotlightId(null);
      }
      return;
    }

    // 2. Once the 10th (last) spotlight record has passed the focus zone:
    // restore normal browsing for every record
    if (lastCenter < focusTop || lastRect.bottom < focusTop + 60) {
      if (activeSpotlightIdRef.current !== null) {
        activeSpotlightIdRef.current = null;
        setActiveSpotlightId(null);
      }
      return;
    }

    // 3. Within the spotlight sequence: find the grant closest to viewport focus center
    let closestId: string | null = null;
    let minDistance = Infinity;

    for (const grant of first10Grants) {
      const el = cardRefs.current.get(grant.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - focusCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestId = grant.id;
      }
    }

    if (closestId !== activeSpotlightIdRef.current) {
      activeSpotlightIdRef.current = closestId;
      setActiveSpotlightId(closestId);
    }
  }, [first10Grants, isReducedMotion]);

  useEffect(() => {
    if (isReducedMotion || first10Grants.length === 0) {
      activeSpotlightIdRef.current = null;
      return;
    }

    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          updateSpotlight();
          ticking = false;
        });
      }
    };

    // Evaluate after paint
    const rafId = window.requestAnimationFrame(() => {
      updateSpotlight();
    });

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [updateSpotlight, isReducedMotion, first10Grants.length]);

  return (
    <div id="explorer" className="scroll-mt-24">
      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <label htmlFor={searchInputId} className="sr-only">
            Search funding records by scheme, agency, beneficiary, roll number, or patent
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
            <Search className="size-4" aria-hidden />
          </div>
          <input
            id={searchInputId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scheme, agency, scholar, mentor, startup, patent number, or amount..."
            className="h-11 w-full rounded-md border border-line bg-white pl-10 pr-10 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-hidden transition-colors"
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

        {/* Filter Tabs */}
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
                  "inline-flex h-8.5 items-center gap-2 rounded-sm border px-3 text-xs transition-colors",
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

        {/* Results Counter & Reset Action */}
        <div className="flex items-center justify-between border-b border-line pb-3 pt-1 text-xs text-muted">
          <p aria-live="polite">
            Showing <span className="font-mono font-medium text-ink">{filteredGrants.length}</span> of{" "}
            <span className="font-mono text-ink">{grants.length}</span> funding records
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
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Structured Results List */}
      <div className="mt-6 space-y-4">
        {filteredGrants.length === 0 ? (
          <div className="rounded-lg border border-line bg-paper p-8 text-center sm:p-12">
            <p className="font-medium text-ink text-base">No funding records match your criteria.</p>
            <p className="mt-1 text-sm text-muted">
              Try adjusting your search terms or clearing the selected filter category.
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
          filteredGrants.map((g, idx) => {
            const isEligible = idx < 10;
            const isSpotlightActive =
              !isReducedMotion &&
              activeSpotlightId !== null &&
              spotlightIdSet.has(activeSpotlightId);
            const isPrimaryActive =
              isSpotlightActive &&
              isEligible &&
              (activeSpotlightId === g.id || hoveredSpotlightId === g.id);
            const isSubdued = isSpotlightActive && isEligible && !isPrimaryActive;

            return (
              <article
                key={g.id}
                id={g.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current.set(g.id, el);
                  } else {
                    cardRefs.current.delete(g.id);
                  }
                }}
                onMouseEnter={() => {
                  if (isEligible && isSpotlightActive) {
                    setHoveredSpotlightId(g.id);
                  }
                }}
                onMouseLeave={() => {
                  if (hoveredSpotlightId === g.id) {
                    setHoveredSpotlightId(null);
                  }
                }}
                onFocus={() => {
                  if (isEligible && isSpotlightActive) {
                    setHoveredSpotlightId(g.id);
                  }
                }}
                onBlur={() => {
                  if (hoveredSpotlightId === g.id) {
                    setHoveredSpotlightId(null);
                  }
                }}
                aria-current={isPrimaryActive ? "true" : undefined}
                className={cn(
                  "group rounded-lg p-5 sm:p-6 scroll-mt-24 transition-[transform,opacity,filter,border-color,box-shadow] duration-[250ms] ease-out will-change-[transform,opacity,filter] motion-reduce:transform-none motion-reduce:filter-none motion-reduce:opacity-100 motion-reduce:transition-none",
                  isPrimaryActive
                    ? "scale-[1.025] sm:scale-[1.03] opacity-100 filter-none border border-ink/80 shadow-md ring-1 ring-blue/20 bg-white z-10 relative"
                    : isSubdued
                    ? "scale-100 opacity-70 blur-[1.5px] border border-line bg-white z-0 relative hover:scale-[1.02] hover:opacity-100 hover:filter-none hover:border-line-strong hover:z-10 focus-within:scale-[1.02] focus-within:opacity-100 focus-within:filter-none focus-within:border-ink focus-within:z-10"
                    : "scale-100 opacity-100 filter-none border border-line bg-white hover:border-line-strong hover:shadow-2xs z-0 relative focus-within:border-ink",
                )}
              >
              {/* Header: Agency, Kind, Year & Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                    {g.agency}
                  </span>
                  {g.grantKind && (
                    <span
                      className={cn(
                        "rounded-xs border px-1.5 py-0.2 font-mono text-[0.62rem] uppercase tracking-wider",
                        g.grantKind === "Seed Funding"
                          ? "border-amber-300 bg-amber-soft text-amber-ink"
                          : g.grantKind === "Awarded Grant"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : g.grantKind === "Fellowship"
                          ? "border-purple-200 bg-purple-50 text-purple-800"
                          : "border-line bg-mist text-muted",
                      )}
                    >
                      {g.grantKind}
                    </span>
                  )}
                  {g.year && (
                    <span className="font-mono text-xs text-muted">· {g.year}</span>
                  )}
                </div>

                <StatusPill status={g.grantStatus} />
              </div>

              {/* Title & Core Research Summary */}
              <div className="mt-3.5 grid gap-4 lg:grid-cols-12 lg:items-start lg:gap-8">
                <div className="lg:col-span-8">
                  <h3 className="text-base sm:text-lg font-medium text-ink leading-snug">
                    {g.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                    {g.researchArea}
                  </p>

                  {/* Primary Beneficiary / Venture Line */}
                  {(g.beneficiary || g.associatedStartup) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                      {g.beneficiary && (
                        <div className="inline-flex items-center gap-1.5 text-emerald-900 font-medium">
                          <Award className="size-3.5 text-emerald-700 shrink-0" />
                          <span>Awarded to: {g.beneficiary}</span>
                          {g.recipientRoll && (
                            <span className="font-mono text-[0.68rem] text-muted">
                              ({g.recipientRoll})
                            </span>
                          )}
                        </div>
                      )}

                      {g.associatedStartup && (
                        <span className="inline-flex items-center gap-1 rounded-sm border border-purple-200 bg-purple-50 px-1.5 py-0.5 font-mono text-[0.68rem] text-purple-800">
                          <Building2 className="size-3" />
                          {g.associatedStartup}
                        </span>
                      )}

                      {g.associatedPatent && (
                        <span className="inline-flex items-center gap-1 rounded-sm border border-teal/30 bg-teal-soft px-1.5 py-0.5 font-mono text-[0.68rem] text-teal-ink font-medium">
                          <ShieldCheck className="size-3" />
                          {g.associatedPatent}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Amount & Key Metric on the right */}
                <div className="flex flex-row items-baseline justify-between gap-4 border-t border-line/60 pt-3 lg:col-span-4 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                  <div className="lg:text-right">
                    <span className="eyebrow block text-[0.62rem]">
                      {g.grantStatus === "Awarded" ? "Confirmed Value" : "Grant Scope"}
                    </span>
                    <span className="font-mono text-base sm:text-lg font-semibold text-ink block mt-0.5">
                      {g.amount ?? "Official Call"}
                    </span>
                    {g.deadline && (
                      <span className="font-mono text-xs text-muted block mt-0.5">
                        {g.deadline}
                      </span>
                    )}
                  </div>

                  <a
                    href={g.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-ink transition-colors"
                  >
                    <span>Official portal</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>

              {/* Expandable Details for Secondary Information */}
              <details className="group mt-4 border-t border-line/60 pt-3 text-xs text-muted">
                <summary className="flex cursor-pointer items-center justify-between text-xs font-medium text-ink-2 hover:text-ink focus:outline-hidden list-none">
                  <span className="flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-wider text-muted group-hover:text-ink transition-colors">
                    Secondary Details & Mentorship
                  </span>
                  <ChevronDown className="size-3.5 text-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <div className="mt-3.5 grid gap-3 sm:grid-cols-2 rounded-sm border border-line bg-paper/60 p-3.5 text-xs">
                  {g.facultyMentor && (
                    <div>
                      <span className="eyebrow block text-[0.62rem]">Faculty Mentors / Supervisors</span>
                      <p className="mt-0.5 text-ink-2 font-medium">{g.facultyMentor}</p>
                    </div>
                  )}

                  <div>
                    <span className="eyebrow block text-[0.62rem]">Scope & Eligibility</span>
                    <p className="mt-0.5 text-ink-2">{g.eligibility}</p>
                  </div>

                  {g.associatedPatent && (
                    <div>
                      <span className="eyebrow block text-[0.62rem]">Patent / IPR Application</span>
                      <p className="mt-0.5 font-mono text-xs text-teal-ink font-medium">
                        {g.associatedPatent}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="eyebrow block text-[0.62rem]">Categories & Domains</span>
                    <p className="mt-0.5 text-muted font-mono text-[0.68rem]">
                      {g.categories.join(" · ")}
                    </p>
                  </div>
                </div>
              </details>
            </article>
          );
        })
      )}
      </div>
    </div>
  );
}
