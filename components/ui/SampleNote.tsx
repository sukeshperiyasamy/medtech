import { cn } from "@/lib/utils";

/**
 * Demo-content markers. Sample records are only served in development / review builds
 * (see SHOW_SAMPLES in lib/data), and must be visually unmistakable when they are.
 */
const HATCH = "bg-[repeating-linear-gradient(135deg,#fef3c7_0_6px,#fffbeb_6px_12px)]";

export function SampleBadge({ className, children = "Demo" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border border-amber-400 px-2 py-0.5 font-mono text-[0.66rem] font-medium uppercase tracking-[0.08em] text-amber-ink",
        HATCH,
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
      {children}
    </span>
  );
}

export function SampleNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-start gap-3 border border-amber-400 px-4 py-3 text-sm text-amber-ink", HATCH, className)}>
      <SampleBadge className="mt-px shrink-0 bg-white">Demo content</SampleBadge>
      <span className="font-medium">{children}</span>
    </p>
  );
}

/** Full-width ribbon placed across a demo record. */
export function DemoRibbon({ label = "Demo content — not a real record" }: { label?: string }) {
  return (
    <div className={cn("border-b border-amber-400 px-4 py-2 text-center font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-amber-ink", HATCH)}>
      {label}
    </div>
  );
}
