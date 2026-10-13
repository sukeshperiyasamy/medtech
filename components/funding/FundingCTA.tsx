import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

export function FundingCTA({
  contactEmail = "office_medtechcentre@iitj.ac.in",
}: {
  contactEmail?: string;
}) {
  return (
    <section className="section-y bg-paper/60 border-t border-line">
      <div className="container-x">
        <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-white p-8 sm:p-12 lg:p-16 shadow-xs">
          <div className="space-y-6 sm:space-y-7">
            <div>
              <p className="eyebrow mb-3.5 text-blue">Partner with Us</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink leading-[1.25]">
                Collaborate on medical technology research &amp; venture creation.
              </h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-ink-2 max-w-3xl">
              Whether you are a healthcare investor evaluating early-stage medical ventures, an industry sponsor seeking targeted device translation, or an extramural funding body, the Centre provides institutional infrastructure, hospital attachment with AIIMS Jodhpur, and verified IP.
            </p>

            {/* Action Buttons with Generous Breathing Room */}
            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4 lg:gap-5">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  "Partnership / Funding Inquiry — MedTech Centre",
                )}`}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-md bg-ink px-6 text-sm font-medium text-white shadow-xs transition-colors hover:bg-blue active:scale-95"
              >
                <Mail className="size-4 shrink-0" />
                <span>Contact the Centre Office</span>
              </a>

              <Link
                href="/startups"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-5 text-sm font-medium text-ink transition-all hover:border-ink hover:bg-mist active:scale-95"
              >
                <span>Explore Incubated Startups</span>
                <ArrowUpRight className="size-4 text-blue shrink-0" />
              </Link>

              <Link
                href="/research"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line-strong bg-white px-5 text-sm font-medium text-ink transition-all hover:border-ink hover:bg-mist active:scale-95"
              >
                <span>View Research Verticals</span>
                <ArrowUpRight className="size-4 text-muted shrink-0" />
              </Link>
            </div>

            {/* Institutional Footnote */}
            <div className="pt-6 sm:pt-8 border-t border-line/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted">
              <span>Joint Medical Technology Centre · IIT Jodhpur &amp; AIIMS Jodhpur</span>
              <span>W16 Berm, Karwar, Rajasthan 342030</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

