import { ArrowUpRight } from "lucide-react";

/** Shown in production when a collection has no verified records yet. */
export function EmptyState({ title, body, email, subject }: { title: string; body: string; email?: string; subject?: string }) {
  return (
    <div className="border border-dashed border-line-strong bg-white px-6 py-12 text-center sm:px-10">
      <p className="text-[1.25rem] tracking-[-0.015em] text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-[0.95rem] text-muted">{body}</p>
      {email && (
        <a
          href={`mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue"
        >
          <span className="link-line">{email}</span>
          <ArrowUpRight aria-hidden className="size-3.5" />
        </a>
      )}
    </div>
  );
}
