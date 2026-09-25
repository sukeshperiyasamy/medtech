import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/** Shared by page sections so they work both on the homepage and on dedicated pages. */
export interface SectionProps {
  /** Editorial index, e.g. "02". Omit for no number. */
  index?: string;
  /** Set false when the page header already titles this content. */
  heading?: boolean;
}

interface Props {
  index?: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  className?: string;
  /** "split" puts the title left and intro right on desktop. */
  layout?: "split" | "stacked";
}

/** Editorial section header: numbered technical label, headline, optional intro. */
export function SectionHeading({ index, label, title, intro, id, className, layout = "split" }: Props) {
  return (
    <header
      className={cn(
        "grid gap-6",
        layout === "split" && "lg:grid-cols-12 lg:items-end lg:gap-12",
        className,
      )}
    >
      <Reveal className={cn(layout === "split" && "lg:col-span-7")}>
        <p className="eyebrow mb-5 flex items-center gap-3">
          {index && (
            <>
              <span className="text-blue">{index}</span>
              <span aria-hidden className="h-px w-8 bg-line-strong" />
            </>
          )}
          <span>{label}</span>
        </p>
        <h2 id={id} className="text-h2 text-ink">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1} className={cn(layout === "split" && "lg:col-span-5 lg:pb-2")}>
          <p className="text-lead max-w-xl text-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
