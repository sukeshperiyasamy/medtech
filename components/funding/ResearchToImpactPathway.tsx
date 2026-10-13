export function ResearchToImpactPathway() {
  const steps = [
    {
      num: "01",
      phase: "Clinical Need",
      institution: "AIIMS Jodhpur",
      title: "Bedside Problem Formulation",
      desc: "Direct clinical immersion where AIIMS clinicians and IITJ engineers identify real bedside diagnostic and surgical challenges.",
      funding: "Joint Institutional Support",
    },
    {
      num: "02",
      phase: "Research & R&D",
      institution: "IIT Jodhpur",
      title: "Interdisciplinary Engineering",
      desc: "Biomedical modeling, bio-MEMS design, and algorithmic development across joint engineering departments.",
      funding: "PMRF, DAAD & Doctoral Grants",
    },
    {
      num: "03",
      phase: "Prototyping",
      institution: "Cleanrooms & Labs",
      title: "Hardware & Biosensor Build",
      desc: "Fabrication of working sensor arrays, mechanical syringe actuators, and 3D bioprinted scaffolds.",
      funding: "MSME Idea Hackathon (₹15L)",
    },
    {
      num: "04",
      phase: "Validation & IP",
      institution: "Clinical Trials",
      title: "Hospital Testing & Patent Filings",
      desc: "Simulated procedural testing, ex-vivo verification, safety compliance, and Indian patent protection.",
      funding: "BIRAC BIG (₹50L) & ANRF",
    },
    {
      num: "05",
      phase: "Translation",
      institution: "TISC Incubation",
      title: "Venture Spinout & Seed Capital",
      desc: "Formal company incorporation, incubation agreements, CDSCO pathway clearance, and angel capital.",
      funding: "SWASAM ($100K) & TISC Seed",
    },
  ];

  return (
    <section className="section-y border-b border-line bg-paper/40">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">02 — Innovation Pathway</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            From clinical insight to commercial deployment.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            How funding stages align with the joint IIT Jodhpur and AIIMS Jodhpur translational pipeline.
          </p>
        </div>

        {/* Horizontal Progression (Desktop) / Vertical Stack (Mobile) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative flex flex-col justify-between rounded-lg border border-line bg-white p-5 transition-all hover:border-line-strong hover:shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between border-b border-line/60 pb-3">
                  <span className="font-mono text-xs font-semibold text-blue">{s.num}</span>
                  <span className="font-mono text-[0.66rem] uppercase tracking-wider text-muted">
                    {s.phase}
                  </span>
                </div>

                <div className="mt-3.5">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-teal-ink block font-medium">
                    {s.institution}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-ink leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-line/60 pt-3">
                <span className="eyebrow block text-[0.62rem]">Funding Mechanism</span>
                <span className="mt-0.5 block font-mono text-[0.72rem] font-medium text-ink-2">
                  {s.funding}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
