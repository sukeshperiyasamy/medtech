"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Mail, Search } from "lucide-react";
import type { Person } from "@/lib/types";
import { cn, isRemote } from "@/lib/utils";

const INITIAL = 10;

function Avatar({ person, size = 48 }: { person: Person; size?: number }) {
  if (!person.photo) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-mist font-mono text-xs text-muted"
      >
        {person.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </span>
    );
  }
  return (
    <Image
      src={person.photo.src}
      unoptimized={isRemote(person.photo.src)}
      loading="lazy"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover grayscale-[30%] transition duration-500 group-hover:grayscale-0"
    />
  );
}

export function PeopleDirectory({ people }: { people: Person[] }) {
  const groups = useMemo(() => Array.from(new Set(people.map((p) => p.category))), [people]);
  const [group, setGroup] = useState<string>(groups[0]);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people.filter(
      (p) =>
        (term ? true : p.category === group) &&
        (!term || [p.name, p.designation, ...p.researchInterests].join(" ").toLowerCase().includes(term)),
    );
  }, [people, group, q]);

  const shown = expanded || q ? filtered : filtered.slice(0, INITIAL);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter people" className="flex gap-1">
          {groups.map((g) => {
            const count = people.filter((p) => p.category === g).length;
            const on = g === group && !q;
            return (
              <button
                key={g}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setGroup(g);
                  setQ("");
                  setExpanded(false);
                }}
                className={cn(
                  "h-9 rounded-sm px-3 text-[0.87rem] transition-colors",
                  on ? "bg-ink text-white" : "text-ink-2 hover:bg-mist",
                )}
              >
                {g} <span className={cn("font-mono text-[0.7rem]", on ? "text-white/60" : "text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Search people by name or research interest</span>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or research interest"
            className="h-10 w-full rounded-sm border border-line bg-white pl-9 pr-3 text-[0.9rem] text-ink placeholder:text-muted focus:border-blue focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-blue/20"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">{filtered.length} people found</p>

      <ul className="grid sm:grid-cols-2">
        {shown.map((p) => (
          <li key={p.id} className="group flex gap-4 border-b border-line py-5 sm:pr-6 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:pl-6">
            <Avatar person={p} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1.02rem] font-medium leading-tight text-ink">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.designation}</p>
                </div>
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-mist hover:text-ink"
                  >
                    <Mail className="size-4" aria-hidden />
                    <span className="sr-only">Email {p.name}</span>
                  </a>
                )}
              </div>
              {p.researchInterests.length > 0 && (
                <p className="mt-2 line-clamp-2 text-[0.85rem] leading-relaxed text-ink-2">
                  {p.researchInterests.join(" · ")}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p className="py-10 text-muted">No one matches “{q}”.</p>}

      {!q && filtered.length > INITIAL && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-6 h-11 rounded-sm border border-line-strong px-5 text-[0.92rem] font-medium text-ink transition-colors hover:border-ink"
        >
          {expanded ? "Show fewer" : `Show all ${filtered.length}`}
        </button>
      )}
    </div>
  );
}
