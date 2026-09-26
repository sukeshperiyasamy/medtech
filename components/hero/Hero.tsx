import { ButtonLink } from "@/components/ui/ButtonLink";
import type { SiteConfig } from "@/lib/types";

interface Fact {
  label: string;
  value: string;
}

const lines = [["Engineering", "the"], ["future", "of", "medicine."]].map((words, li, all) => {
  const offset = all.slice(0, li).reduce((n, l) => n + l.length, 0);
  return words.map((word, wi) => ({ word, i: offset + wi }));
});

/** Full-width typographic hero. Entrance is CSS-only so it never waits on hydration. */
export function Hero({ site, facts }: { site: SiteConfig; facts: Fact[] }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Soft blue → cyan → teal glow (the site's accent colours) with the fine grid on top */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow">
        <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      <div className="container-x relative pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-28">
        <p className="anim-fade-up eyebrow mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 lg:mb-10">
          <span className="text-ink">{site.parent}</span>
          <span aria-hidden className="h-px w-6 bg-line-strong" />
          <span>{site.name}</span>
        </p>

        <h1
          id="hero-title"
          className="text-[clamp(3rem,1.2rem+7vw,8rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink"
        >
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.map(({ word, i }) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="anim-rise" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                    {word === "medicine." ? (
                      <>
                        medicine<span className="text-blue">.</span>
                      </>
                    ) : (
                      word
                    )}
                  </span>
                  {" "}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div
          className="anim-fade-up mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end"
          style={{ animationDelay: "0.55s" }}
        >
          <div className="lg:col-span-7">
            <p className="text-lead max-w-[36rem] text-ink-2">
              Where clinical insight, engineering and entrepreneurship come together to create
              technologies for real-world healthcare.
            </p>
            <p className="eyebrow mt-5 !text-ink">IIT Jodhpur × AIIMS Jodhpur</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <ButtonLink href="/about">Explore the Centre</ButtonLink>
            <ButtonLink href="/research" variant="secondary">
              Explore research
            </ButtonLink>
          </div>
        </div>

        <dl
          className="anim-fade-up mt-16 grid grid-cols-2 border-t border-line lg:mt-24 lg:grid-cols-4"
          style={{ animationDelay: "0.9s" }}
        >
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={`border-line py-5 pr-4 ${i % 2 === 1 ? "border-l pl-4" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}
            >
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-2 text-[0.98rem] leading-snug text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
