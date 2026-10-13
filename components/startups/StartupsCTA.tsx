import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

export function StartupsCTA({ contactEmail }: { contactEmail: string }) {
  return (
    <section className="section-y bg-paper border-b border-line">
      <div className="container-x">
        <div className="rounded-xl border border-line bg-white p-8 sm:p-12 lg:p-16 shadow-2xs">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Venture Collaboration &amp; Incubation</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Partner with MedTech ventures at IIT Jodhpur.
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-2">
              Whether you are an interdisciplinary biomedical researcher, an AIIMS Jodhpur clinician formulating a bedside challenge, an early-stage angel investor, or a healthcare industry partner, the Centre provides institutional incubation, laboratory infrastructure, and clinical co-development pathways.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("Venture & Incubation Enquiry")}`}
                className="inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 text-sm font-medium text-white hover:bg-ink-2 transition-colors shadow-2xs"
              >
                <Mail className="size-4" />
                <span>Contact Incubation Desk</span>
              </a>

              <Link
                prefetch={false}
                href="/funding"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-line bg-white px-5 text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                <span>View Funding &amp; Grants</span>
                <ArrowUpRight className="size-4 text-blue" />
              </Link>

              <Link
                prefetch={false}
                href="/research"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-line bg-white px-5 text-sm font-medium text-ink hover:border-ink transition-colors"
              >
                <span>Research Verticals</span>
                <ArrowUpRight className="size-4 text-muted" />
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted font-mono">
              Technology Innovation &amp; Start-up Centre (TISC), W16 Berm, IIT Jodhpur · Joint MMT Programme with AIIMS Jodhpur
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
