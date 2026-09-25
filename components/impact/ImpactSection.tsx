import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getMetrics } from "@/lib/data";
import { Counter } from "./Counter";

export async function ImpactSection({ index, heading = true }: SectionProps = {}) {
  const metrics = await getMetrics();
  const verified = metrics.filter((m) => m.value !== null);
  const pending = metrics.filter((m) => m.value === null);

  return (
    <section id="impact" aria-labelledby={heading ? "impact-title" : undefined} className="section-y">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="impact-title"
          index={index}
          label="Impact"
          title="Measured, and only what can be verified."
          intro="Figures here are counted from official IIT Jodhpur pages. Research outputs will appear as soon as the Center publishes verified numbers."
        />
        )}

        <dl className="mt-16 grid grid-cols-2 border-t border-ink lg:grid-cols-4">
          {verified.map((m, i) => (
            <Reveal
              key={m.id}
              delay={i * 0.06}
              className={`border-b border-line py-8 pr-4 lg:border-b-0 lg:py-10 ${i % 2 ? "border-l pl-5" : ""} ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
            >
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <p className="text-[clamp(3.2rem,2rem+4vw,5.5rem)] font-medium leading-none tracking-[-0.045em] text-ink">
                  <Counter value={m.value as number} suffix={m.suffix} />
                </p>
                <p className="mt-4 text-[0.98rem] text-ink" aria-hidden>
                  {m.label}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {m.sourceUrl ? (
                    <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                      {m.note}
                    </a>
                  ) : (
                    m.note
                  )}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>

        <dl className="mt-10 grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {pending.map((m) => (
            <div key={m.id} className="bg-white py-5 pr-4 sm:pr-6">
              <dt className="text-[0.95rem] text-ink-2">{m.label}</dt>
              <dd className="mt-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
                <span aria-hidden className="h-px w-5 border-t border-dashed border-muted" />
                {m.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
