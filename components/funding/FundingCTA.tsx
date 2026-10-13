import { ArrowUpRight, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function FundingCTA({
  contactEmail = "head_medtech@iitj.ac.in",
}: {
  contactEmail?: string;
}) {
  return (
    <section className="section-y bg-white">
      <div className="container-x">
        <div className="rounded-xl border border-line bg-paper p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Partner with Us</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink">
              Collaborate on medical technology research & venture creation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Whether you are a healthcare investor evaluating early-stage medical ventures, an industry sponsor seeking targeted device translation, or an extramural funding body, the Centre provides institutional infrastructure, hospital attachment with AIIMS Jodhpur, and verified IP.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  "Partnership / Funding Inquiry — MedTech Centre",
                )}`}
                variant="primary"
              >
                <Mail className="size-4 mr-2" />
                Contact the Centre Office
              </ButtonLink>

              <ButtonLink href="/startups" variant="secondary">
                Explore Incubated Startups
                <ArrowUpRight className="size-4 ml-1.5" />
              </ButtonLink>

              <ButtonLink href="/research" variant="secondary">
                View Research Verticals
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
