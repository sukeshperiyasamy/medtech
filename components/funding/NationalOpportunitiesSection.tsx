import { ExternalLink, HelpCircle } from "lucide-react";
import type { Grant } from "@/lib/types";

export function NationalOpportunitiesSection({
  grants,
  contactEmail = "head_medtech@iitj.ac.in",
}: {
  grants: Grant[];
  contactEmail?: string;
}) {
  const nationalSchemes = grants.filter((g) => g.grantStatus !== "Awarded");

  return (
    <section className="section-y border-b border-line bg-paper/30">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">03 — Ongoing Opportunities</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            National funding schemes & open application calls.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            External competitive programmes and industry sponsorship channels available to eligible IIT Jodhpur faculty, research scholars, and clinician-scientists. These are open funding pathways—not awards received by the Centre.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nationalSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="flex flex-col justify-between rounded-lg border border-line bg-white p-6 transition-all hover:border-line-strong hover:shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-line/60 pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                    {scheme.agency}
                  </span>
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-cyan-ink font-medium rounded-xs border border-cyan/40 bg-cyan-soft px-2 py-0.5">
                    {scheme.grantStatus}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-medium text-ink leading-snug">
                  {scheme.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-2">
                  {scheme.researchArea}
                </p>

                <div className="mt-4 border-t border-line/60 pt-3 space-y-2 text-xs text-muted">
                  <div>
                    <span className="eyebrow block text-[0.62rem]">Typical Grant Scope</span>
                    <span className="font-mono text-xs font-medium text-ink block mt-0.5">
                      {scheme.amount ?? "Project-specific"}
                    </span>
                  </div>

                  <div>
                    <span className="eyebrow block text-[0.62rem]">Eligibility</span>
                    <span className="text-xs text-ink-2 block mt-0.5">
                      {scheme.eligibility}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-muted uppercase">
                  {scheme.deadline ?? "Official Notice"}
                </span>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-ink transition-colors"
                >
                  Official Scheme
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Note */}
        <div className="mt-8 flex items-start gap-3 rounded-md border border-line bg-white p-4 text-xs text-muted">
          <HelpCircle className="size-4 shrink-0 text-blue mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-medium text-ink">Applying for Extramural Funding: </span>
            Centre researchers and clinical investigators from AIIMS Jodhpur and IIT Jodhpur receive joint proposal review, ethics board clearance facilitation, and TISC incubation support. To discuss submission endorsement, reach the Centre office at{" "}
            <a
              href={`mailto:${contactEmail}?subject=Funding%20Proposal%20Consultation`}
              className="text-blue hover:underline"
            >
              {contactEmail}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
