import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "text";

const styles: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-blue px-5 h-12 text-[0.95rem] rounded-sm",
  secondary:
    "border border-line-strong text-ink hover:border-ink bg-white px-5 h-12 text-[0.95rem] rounded-sm",
  text: "text-ink hover:text-blue text-[0.95rem] h-auto px-0",
};

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Opens off-site links in a new tab with an out-arrow icon. */
  external?: boolean;
}

export function ButtonLink({ href, children, variant = "primary", className, external }: Props) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const Icon = isExternal ? ArrowUpRight : ArrowRight;
  const cls = cn(
    "group inline-flex items-center gap-3 font-medium transition-colors duration-300",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      <Icon
        aria-hidden
        className={cn(
          "size-4 transition-transform duration-300 ease-[var(--ease-precise)]",
          isExternal ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1",
        )}
      />
      {isExternal && <span className="sr-only">(opens in a new tab)</span>}
    </>
  );

  if (isExternal || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
