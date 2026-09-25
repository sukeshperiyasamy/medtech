"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Achievement, GalleryImage } from "@/lib/types";
import { cn, formatDateRange } from "@/lib/utils";
import { Lightbox } from "@/components/gallery/Lightbox";

export interface ResolvedAchievement extends Achievement {
  /** Recipients with their programme / cohort, resolved from the student register. */
  people: { name: string; context?: string }[];
}

const AUDIENCE_LABEL = { Student: "Students & alumni", Faculty: "Faculty", Centre: "Centre" } as const;

/** Reader-facing groups of the data categories. */
const TYPES: { label: string; categories: Achievement["category"][] }[] = [
  { label: "Awards & medals", categories: ["Award", "Medal", "Recognition"] },
  { label: "Fellowships & selections", categories: ["Fellowship", "Selection"] },
  { label: "Funding", categories: ["Grant", "Investment"] },
  { label: "Patents", categories: ["Patent"] },
  { label: "Competitions", categories: ["Competition"] },
];

/** Editorial list of achievements, grouped by year, with an optional audience filter. */
export function AchievementsList({ items }: { items: ResolvedAchievement[] }) {
  const audiences = useMemo(() => Array.from(new Set(items.map((a) => a.audience))), [items]);
  const types = TYPES.filter((t) => items.some((a) => t.categories.includes(a.category)));
  const [audience, setAudience] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  const shown = items.filter(
    (a) =>
      (audience === "all" || a.audience === audience) &&
      (type === "all" || TYPES.find((t) => t.label === type)?.categories.includes(a.category)),
  );
  const years = Array.from(new Set(shown.map((a) => a.year)));

  // Photos for the viewer, in list order.
  const photos: GalleryImage[] = shown
    .filter((a) => a.image)
    .map((a) => ({
      id: a.id,
      src: a.image!.src,
      alt: a.image!.alt,
      width: a.image!.width,
      height: a.image!.height,
      caption: `${a.title} — ${a.people.map((p) => p.name).join(", ")}`,
      date: a.date,
    }));

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink pb-4">
        <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-1">
          {["all", ...types.map((t) => t.label)].map((t) => {
            const on = t === type;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setType(t)}
                className={cn("h-9 rounded-sm px-3.5 text-[0.88rem] transition-colors", on ? "bg-ink text-white" : "text-ink-2 hover:bg-mist")}
              >
                {t === "all" ? "All" : t}
              </button>
            );
          })}
        </div>
        {audiences.length > 1 && (
          <>
            <span aria-hidden className="hidden h-5 w-px bg-line-strong sm:block" />
            <div role="group" aria-label="Filter by people" className="flex flex-wrap gap-1">
              {audiences.map((a) => {
                const on = a === audience;
                return (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAudience(on ? "all" : a)}
                    className={cn(
                      "h-9 rounded-sm border px-3.5 text-[0.88rem] transition-colors",
                      on ? "border-ink bg-ink text-white" : "border-line text-ink-2 hover:border-line-strong",
                    )}
                  >
                    {AUDIENCE_LABEL[a as keyof typeof AUDIENCE_LABEL]}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {shown.length === 0 && <p className="py-10 text-muted">No achievements match this filter.</p>}

      {years.map((year) => (
        <section key={year} aria-labelledby={`ach-${year}`} className="grid gap-4 border-t border-ink pb-6 md:grid-cols-[8rem_1fr] md:gap-8">
          <h2 id={`ach-${year}`} className="pt-6 text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-ink">
            {year}
          </h2>
          <ol>
            {shown
              .filter((a) => a.year === year)
              .map((a) => {
                const photoIndex = photos.findIndex((p) => p.id === a.id);
                return (
                  <li key={a.id} className="grid gap-6 border-b border-line py-7 last:border-b-0 sm:grid-cols-[1fr_9rem] sm:gap-10">
                    <article aria-labelledby={`ach-title-${a.id}`}>
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="eyebrow !text-blue">{a.category}</span>
                        {a.level && <span className="eyebrow">{a.level}</span>}
                        {a.date && (
                          <time className="eyebrow" dateTime={a.date}>
                            {formatDateRange(a.date)}
                          </time>
                        )}
                      </p>
                      {a.venture && (
                        <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-teal-ink">{a.venture}</p>
                      )}
                      <h3 id={`ach-title-${a.id}`} className={cn("text-[1.5rem] leading-tight tracking-[-0.02em] text-ink", a.venture ? "mt-1" : "mt-2")}>
                        {a.title}
                      </h3>
                      {a.awardedBy && <p className="mt-1 text-sm text-muted">{a.awardedBy}</p>}

                      <ul className="mt-4 space-y-1">
                        {a.people.map((p) => (
                          <li key={p.name} className="text-[1.05rem] text-ink">
                            {p.name}
                            {p.context && <span className="ml-2 text-sm text-muted">· {p.context}</span>}
                          </li>
                        ))}
                      </ul>

                      {a.summary && <p className="mt-3 max-w-2xl text-[0.95rem] text-ink-2">{a.summary}</p>}

                      {a.details && (
                        <dl className="mt-4 max-w-2xl border-t border-line">
                          {a.details.map((d) => (
                            <div key={d.label} className="grid gap-1 border-b border-line py-2.5 text-[0.9rem] sm:grid-cols-[9rem_1fr] sm:gap-4">
                              <dt className="text-muted">{d.label}</dt>
                              <dd className="text-ink-2">{d.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </article>

                    {a.image && (
                      <button
                        type="button"
                        onClick={() => setOpen(photoIndex)}
                        className="group relative block self-start overflow-hidden border border-line bg-mist"
                      >
                        <Image
                          src={a.image.src}
                          alt={a.image.alt}
                          width={a.image.width}
                          height={a.image.height}
                          sizes="144px"
                          className="aspect-square w-full object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.02] group-hover:brightness-95"
                        />
                        <span className="sr-only">View the official image for {a.title}</span>
                      </button>
                    )}
                  </li>
                );
              })}
          </ol>
        </section>
      ))}

      <Lightbox images={photos} index={open} onChange={setOpen} title="Achievements" />
    </div>
  );
}
