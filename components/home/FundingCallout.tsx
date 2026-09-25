import { Reveal } from "@/components/ui/Reveal";
import { MoreLink } from "@/components/ui/MoreLink";

/** Restrained homepage pointer to the funding page — no listings on the homepage. */
export function FundingCallout() {
  return (
    <section aria-labelledby="funding-callout-title" className="border-t border-line">
      <div className="container-x py-14 lg:py-16">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
          <p className="eyebrow lg:col-span-2">Funding</p>
          <h2 id="funding-callout-title" className="text-[1.6rem] font-medium leading-tight tracking-[-0.02em] text-ink lg:col-span-5 lg:text-[1.9rem]">
            Funding the next generation of medical technologies
          </h2>
          <div className="lg:col-span-5">
            <p className="text-muted">
              Explore grants and opportunities for researchers, innovators and industry partners.
            </p>
            <MoreLink href="/funding" className="mt-4">Explore funding</MoreLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
