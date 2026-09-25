import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { SampleNote } from "@/components/ui/SampleNote";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { getGrants, getSite } from "@/lib/data";
import type { GrantCategory } from "@/lib/types";
import { FundingExplorer } from "./FundingExplorer";

const CATEGORIES: GrantCategory[] = [
  "Government",
  "Medical Technology",
  "Biotechnology",
  "Deep Tech",
  "Startup",
  "Industry Sponsored",
  "International",
];

export async function FundingSection({ index, heading = true }: SectionProps = {}) {
  const [grants, site] = await Promise.all([getGrants(), getSite()]);
  return (
    <section id="funding" aria-labelledby={heading ? "funding-title" : undefined} className="section-y border-t border-line">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="funding-title"
          index={index}
          label="Funding & grants"
          title="A funding desk for medical technology."
          intro="Government schemes, biotech and deep-tech programmes, start-up support and industry-sponsored research — gathered in one place so that validated work doesn't stall for lack of money."
        />
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <ol className="space-y-6 text-[0.95rem]">
              {[
                ["Discover", "Filter calls by category and research area."],
                ["Qualify", "Check eligibility, amount and deadline at a glance."],
                ["Apply", "Go straight to the official call — the source of truth."],
              ].map(([t, d], i) => (
                <li key={t} className="border-t border-line pt-4">
                  <p className="eyebrow">{`0${i + 1}`}</p>
                  <p className="mt-1 font-medium text-ink">{t}</p>
                  <p className="mt-1 text-muted">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <ButtonLink
                href={`mailto:${site.email}?subject=${encodeURIComponent("Funding opportunities")}`}
                variant="secondary"
              >
                Ask about funding support
              </ButtonLink>
            </div>
          </Reveal>

          <div className="lg:col-span-9">
            {grants.some((g) => g.provenance === "sample") && (
              <SampleNote className="mb-8">
                Rows below reference long-running national schemes to demonstrate the explorer. They
                are not current calls — amounts, deadlines and status must be added from official notices.
              </SampleNote>
            )}
            {grants.length ? (
              <FundingExplorer grants={grants} categories={CATEGORIES} />
            ) : (
              <EmptyState title="Funding listings are being compiled." body="Current, verified calls will be listed here with eligibility, amount and deadline. Meanwhile, contact the Center office for guidance." email={site.email} subject="Funding opportunities" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
