import Link from "next/link";
import { ArrowUpRight, Award, ShieldCheck, Building2, UserCheck, ExternalLink } from "lucide-react";
import type { Grant } from "@/lib/types";

export function FeaturedFunding({ grants }: { grants: Grant[] }) {
  const swasam = grants.find((g) => g.id === "swasam-seed-capital");
  const birac = grants.find((g) => g.id === "birac-big-neonatal");
  const msmeCartilage = grants.find((g) => g.id === "msme-hackathon-cartilage");
  const techex = grants.find((g) => g.id === "techex-transfer-hub");

  return (
    <section className="section-y border-b border-line bg-white">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">01 — Featured Secured Funding</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink">
            Confirmed translational awards & landmark funding.
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">
            Major competitive awards, venture seed capital, and commercialization grants secured by Centre scholars and incubated medical enterprises to transition laboratory research into clinical deployment.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main Anchor Card: SWASAM Seed Investment */}
          {swasam && (
            <div className="flex flex-col justify-between rounded-lg border border-line bg-paper p-6 sm:p-8 lg:col-span-7 transition-all hover:border-line-strong">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                      {swasam.agency}
                    </span>
                    <span className="rounded-xs border border-amber-300/80 bg-amber-soft px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-wider text-amber-ink font-medium">
                      Venture Seed Capital
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-700 font-medium">
                    <Award className="size-3.5" />
                    Confirmed · 2024
                  </span>
                </div>

                <div className="mt-6">
                  <span className="font-mono text-xs text-muted uppercase tracking-wider">
                    Secured Amount
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                      {swasam.amount}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-medium text-ink leading-snug">
                    {swasam.name}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">
                    {swasam.researchArea}
                  </p>
                </div>

                {/* Beneficiary & Mentors Box */}
                <div className="mt-6 rounded-md border border-line bg-white p-4.5 space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <UserCheck className="size-4 shrink-0 text-muted mt-0.5" />
                    <div>
                      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted block">
                        Beneficiary Leads
                      </span>
                      <span className="font-medium text-ink">
                        {swasam.beneficiary}
                      </span>
                      {swasam.recipientRoll && (
                        <span className="ml-1.5 font-mono text-xs text-muted">
                          ({swasam.recipientRoll})
                        </span>
                      )}
                    </div>
                  </div>

                  {swasam.facultyMentor && (
                    <div className="border-t border-line/60 pt-2.5">
                      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted block">
                        Faculty Mentors & Clinical Supervisors
                      </span>
                      <span className="text-ink-2">
                        {swasam.facultyMentor}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 border-t border-line/60 pt-2.5">
                    {swasam.associatedStartup && (
                      <Link
                        href="/startups#caldor-health-technologies"
                        className="inline-flex items-center gap-1 rounded-sm border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-xs text-purple-800 hover:bg-purple-100 transition-colors"
                      >
                        <Building2 className="size-3" />
                        {swasam.associatedStartup}
                      </Link>
                    )}
                    {swasam.associatedPatent && (
                      <span className="inline-flex items-center gap-1 rounded-sm border border-teal/30 bg-teal-soft px-2 py-0.5 font-mono text-xs text-teal-ink font-medium">
                        <ShieldCheck className="size-3" />
                        {swasam.associatedPatent}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs text-muted">
                  Source: Master Incubation Registry & Student Directory
                </span>
                <Link
                  href="/startups#caldor-health-technologies"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue hover:text-ink transition-colors"
                >
                  View Venture Profile
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Right Column: Stack of 3 Key Government & Translation Grants */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {/* BIRAC BIG Grant */}
            {birac && (
              <div className="rounded-lg border border-line bg-paper p-5 sm:p-6 transition-all hover:border-line-strong">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                    {birac.agency}
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-800">
                    {birac.amount}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-[1.05rem] font-medium text-ink leading-snug">
                    {birac.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {birac.researchArea}
                  </p>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs">
                  <p className="text-ink-2">
                    <span className="text-muted">Recipient: </span>
                    <span className="font-medium text-ink">{birac.beneficiary}</span> ({birac.recipientRoll})
                  </p>
                  {birac.facultyMentor && (
                    <p className="text-muted leading-tight">
                      Mentors: <span className="text-ink-2">{birac.facultyMentor}</span>
                    </p>
                  )}
                  {birac.associatedPatent && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 rounded border border-teal/30 bg-teal-soft px-1.5 py-0.5 font-mono text-[0.66rem] text-teal-ink font-medium">
                        <ShieldCheck className="size-3" />
                        {birac.associatedPatent}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                  <span className="font-mono text-[0.68rem] text-muted uppercase">
                    Competitive National Grant
                  </span>
                  <a
                    href={birac.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-ink hover:text-blue transition-colors"
                  >
                    BIRAC Portal
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            )}

            {/* MSME Idea Hackathon 4.0 Trio */}
            {msmeCartilage && (
              <div className="rounded-lg border border-line bg-paper p-5 sm:p-6 transition-all hover:border-line-strong">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                    {msmeCartilage.agency}
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-800">
                    ₹15L Each (3 Grants)
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-[1.05rem] font-medium text-ink leading-snug">
                    MSME Idea Hackathon 4.0 Seed Grants
                  </h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    National innovation grants awarded to three MedTech inventions: Cartilage Reshaping, Neonatal Bilirubin Monitoring, and Sepsis Point-of-Care Diagnostics.
                  </p>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs">
                  <p className="text-ink-2">
                    <span className="text-muted">Awardees: </span>
                    Katyayanee Sharma, Jayant Singhal, Sambit Kumar Keshi
                  </p>
                  <p className="text-muted leading-tight">
                    Faculty Mentors: Prof. Ajay Agarwal & Dr. Sushmita Jha
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                  <span className="font-mono text-[0.68rem] text-muted uppercase">
                    Prototype Validation
                  </span>
                  <a
                    href={msmeCartilage.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-ink hover:text-blue transition-colors"
                  >
                    MSME Innovative
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            )}

            {/* TechEx Technology Transfer Hub */}
            {techex && (
              <div className="rounded-lg border border-line bg-paper p-5 sm:p-6 transition-all hover:border-line-strong">
                <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue font-semibold">
                    {techex.agency}
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-800">
                    Commercialization
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-[1.05rem] font-medium text-ink leading-snug">
                    {techex.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    Translation grant for Healyantra Medical Technologies: Single-operator ultrasound-guided aspiration syringe system.
                  </p>
                </div>

                <div className="mt-3.5 space-y-1 text-xs">
                  <p className="text-ink-2">
                    <span className="text-muted">Team: </span>
                    Dr. Varun Khandelwal, Divesh Kumar Awasthi, Sayak Sarkar
                  </p>
                  <p className="text-muted">
                    Director Mentor: Dr. Hardik Kothadia (IIT Jodhpur)
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                  <Link
                    href="/startups#healyantra-medical-technologies"
                    className="font-mono text-[0.68rem] text-purple-800 uppercase hover:underline"
                  >
                    Healyantra Venture Profile
                  </Link>
                  <Link
                    href="/startups#healyantra-medical-technologies"
                    className="inline-flex items-center gap-1 text-xs text-ink hover:text-blue transition-colors"
                  >
                    Details
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
