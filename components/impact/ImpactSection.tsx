import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";
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
          intro="Every figure here is counted from official IIT Jodhpur records."
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

        {pending.length > 0 && (
          // Outputs without a verified count yet are shown as navigation, not as empty numbers.
          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
            <p className="eyebrow pt-1 lg:col-span-2">Research output</p>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-4 lg:col-span-10">
              {pending.map((m) => (
                <li key={m.id} className="border-t border-line py-4">
                  <p className="text-[0.98rem] text-ink">{m.label}</p>
                  {m.link ? (
                    <MoreLink href={m.link.url} className="mt-1.5 !text-[0.88rem] !font-normal text-muted">
                      {m.link.label}
                    </MoreLink>
                  ) : (
                    <p className="mt-1.5 text-[0.88rem] text-muted">{m.note}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
