import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Editorial "continue to page" link used at the end of sections. Secondary navigation, so it
 * does not prefetch by default (saves data on mobile); pass `prefetch` for key CTAs.
 */
export function MoreLink({
  href,
  children,
  className,
  prefetch = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch ? undefined : false}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink hover:text-blue",
        className,
      )}
    >
      <span className="link-line">{children}</span>
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
