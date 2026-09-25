import { cn } from "@/lib/utils";

/** Visible marker for placeholder / sample content that must be replaced before launch. */
export function SampleBadge({ className, children = "Sample" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border border-amber-300/70 bg-amber-soft px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-amber-ink",
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
    <p
      className={cn(
        "flex items-start gap-3 border-l-2 border-amber-400 bg-amber-soft/60 px-4 py-3 text-sm text-amber-ink",
        className,
      )}
    >
      <SampleBadge className="mt-px shrink-0">Placeholder</SampleBadge>
      <span>{children}</span>
    </p>
  );
}
