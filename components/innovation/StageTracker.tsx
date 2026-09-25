import type { ProjectStage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StageTracker({ stages, current }: { stages: ProjectStage[]; current: ProjectStage }) {
  const idx = stages.indexOf(current);
  return (
    <div>
      <p className="sr-only">
        Current stage: {current} ({idx + 1} of {stages.length})
      </p>
      <ol aria-hidden className="grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}>
        {stages.map((s, i) => (
          <li key={s} className="flex flex-col gap-2.5">
            <span className={cn("h-[3px]", i <= idx ? "bg-blue" : "bg-line", i === idx && "bg-gradient-to-r from-blue to-cyan")} />
            <span
              className={cn(
                "font-mono text-[0.62rem] uppercase tracking-[0.06em] sm:text-[0.66rem]",
                i === idx ? "text-ink" : i < idx ? "text-ink-2" : "text-muted/70",
              )}
            >
              {s}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
