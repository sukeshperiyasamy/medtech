import { cn } from "@/lib/utils";

interface Props {
  /** What the final photograph should show — guides the content team. */
  brief: string;
  ratio?: string;
  className?: string;
  figure?: string;
}

/**
 * Art-directed stand-in for official photography. Keeps the final aspect ratio so
 * layouts don't shift when real images arrive, and states what the image should be.
 */
export function ImagePlaceholder({ brief, ratio = "16 / 10", className, figure }: Props) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${brief}`}
      style={{ aspectRatio: ratio }}
      className={cn("relative overflow-hidden bg-mist bg-grid-fine", className)}
    >
      <svg aria-hidden className="absolute inset-0 size-full text-line-strong" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="0.75" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.75" />
      </svg>
      {/* corner registration marks */}
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map((c) => (
        <span key={c} aria-hidden className={cn("absolute size-3 border-blue/60", c)} />
      ))}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
        <div className="max-w-[28ch] bg-white/90 px-3 py-2 backdrop-blur-[2px]">
          <p className="eyebrow !text-[0.62rem] text-amber-ink">Photograph pending</p>
          <p className="mt-1 text-[0.8rem] leading-snug text-ink-2">{brief}</p>
        </div>
        {figure && <p className="eyebrow hidden bg-white/90 px-2 py-1 !text-[0.62rem] sm:block">{figure}</p>}
      </div>
    </div>
  );
}
