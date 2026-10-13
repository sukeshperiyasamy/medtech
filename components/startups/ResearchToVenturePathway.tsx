import { Stethoscope, Microscope, Wrench, ShieldCheck, Rocket, ArrowRight } from "lucide-react";

export function ResearchToVenturePathway() {
  const steps = [
    {
      num: "01",
      title: "Clinical Need",
      lead: "AIIMS Jodhpur",
      icon: Stethoscope,
      desc: "Researchers observe real bedside challenges across surgical and clinical wards.",
    },
    {
      num: "02",
      title: "Interdisciplinary R&D",
      lead: "IIT Jodhpur",
      icon: Microscope,
      desc: "Engineering departments develop bio-MEMS, sensor arrays, and computational models.",
    },
    {
      num: "03",
      title: "Functional Prototype",
      lead: "Cleanrooms & Labs",
      icon: Wrench,
      desc: "Working hardware and bioprinted scaffolds are fabricated with prototype grant support.",
    },
    {
      num: "04",
      title: "Validation & IP",
      lead: "Simulation & IPR Cell",
      icon: ShieldCheck,
      desc: "Ex-vivo simulation with clinicians leads to Indian Patent Office application filings.",
    },
    {
      num: "05",
      title: "Venture Translation",
      lead: "TISC Incubation",
      icon: Rocket,
      desc: "Startups incorporate under formal agreements, securing seed capital and incubation.",
    },
  ];

  return (
    <section id="pathway" className="py-12 sm:py-16 border-b border-line bg-paper/40 scroll-mt-24">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-xl mb-8">
          <p className="eyebrow mb-2">Translation Pipeline</p>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-ink">
            The Centre&apos;s innovation framework.
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            How clinical insight at AIIMS Jodhpur connects to engineering design and company spinouts at IIT Jodhpur.
          </p>
        </div>

        {/* 5-Step Single-Sentence Progression */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="relative rounded-md border border-line bg-white p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-line/60 pb-2 mb-2.5">
                    <span className="font-mono text-xs font-semibold text-blue">{st.num}</span>
                    <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted font-medium">
                      {st.lead}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="size-3.5 text-ink-2 shrink-0" />
                    <h3 className="text-xs font-semibold text-ink leading-snug">{st.title}</h3>
                  </div>

                  <p className="text-[0.78rem] text-muted leading-relaxed">{st.desc}</p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-line-strong pointer-events-none">
                    <ArrowRight className="size-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
