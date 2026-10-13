import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Award, Zap, Stethoscope, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResolvedStartup } from "./StartupShowcase";

export function FeaturedVentures({
  startups,
}: {
  startups: ResolvedStartup[];
}) {
  const caldor = startups.find((s) => s.id === "caldor-health-technologies");
  const healyantra = startups.find((s) => s.id === "healyantra-medical-technologies");
  const sarbit = startups.find((s) => s.id === "sarbit-innovations");
  const novealthy = startups.find((s) => s.id === "novealthy-innovations");

  return (
    <section id="ventures" className="section-y border-b border-line bg-white scroll-mt-24">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 lg:mb-12">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2.5">Featured Portfolio</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Translational spotlights.
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted">
              Curated medical engineering spinouts advancing from clinical need formulation at AIIMS Jodhpur into patent-protected prototypes and venture incubation.
            </p>
          </div>

          <a
            href="#directory"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue hover:text-ink transition-colors"
          >
            <span>View all 10 ventures</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        {/* Lead Featured Venture: Caldor Health Technologies */}
        {caldor && (
          <article className="rounded-xl border border-line bg-paper/50 overflow-hidden shadow-2xs hover:border-line-strong transition-all mb-8">
            <div className="grid gap-0 lg:grid-cols-12 items-stretch">
              {/* Left Column: Core Innovation Showcase */}
              <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Category, Stage & Highlights */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 font-mono text-[0.7rem] font-medium text-purple-800">
                      <span className="size-1.5 rounded-full bg-purple-600" />
                      {caldor.incubationStage}
                    </span>
                    <span className="rounded-full bg-blue-soft border border-blue/20 px-2.5 py-0.5 font-mono text-[0.7rem] text-blue font-medium">
                      {caldor.domainSpotlight}
                    </span>
                    <span className="font-mono text-[0.7rem] text-muted">· TRL 5</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-ink">
                    {caldor.name}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base font-medium text-blue">
                    {caldor.product.name}
                  </p>

                  <p className="mt-3.5 text-sm sm:text-[0.95rem] leading-relaxed text-ink-2 max-w-xl">
                    Non-thermal electromechanical tissue remodelling platform for minimally invasive reconstructive surgery, reshaping cartilaginous structures in situ through controlled electrochemical modification.
                  </p>

                  {/* Highlights Row */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-300 bg-emerald-50/70 px-3 py-1 text-xs font-mono text-emerald-800">
                      <Award className="size-3.5 text-emerald-700" />
                      <span>US$ 100K Seed · SWASAM Syndicate</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-sm border border-teal/30 bg-teal-soft/70 px-3 py-1 text-xs font-mono text-teal-ink">
                      <ShieldCheck className="size-3.5" />
                      <span>Patent App 202411033887</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Explore Action */}
                <div className="mt-8 pt-6 border-t border-line/80 flex items-center justify-between">
                  <div className="text-xs text-muted">
                    <span>Led by: </span>
                    <span className="font-medium text-ink">Thilak Chakravarthy, Harisharan Ramesh &amp; Prof. Ajay Agarwal</span>
                  </div>

                  <Link
                    href={`/startups/${caldor.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-ink-2 transition-colors shrink-0 shadow-2xs"
                  >
                    <span>Explore venture dossier</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Device / Schematic Presentation */}
              <div className="border-t lg:border-t-0 lg:border-l border-line bg-gradient-to-br from-paper via-white to-mist/60 p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted mb-4">
                    <span>INNOVATION HIGHLIGHT</span>
                    <span>TISC / IIT Jodhpur</span>
                  </div>

                  {/* Editorial Graphic Box */}
                  <div className="rounded-lg border border-line bg-white p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue font-semibold">
                      <Zap className="size-4" />
                      <span>Electrochemical Micro-Current Modality</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted">
                      Uncoupling cartilage repositioning from open excision splints, reducing hospital recovery from weeks to an outpatient procedure.
                    </p>
                    <div className="border-t border-line/60 pt-3 flex items-center justify-between text-xs font-mono text-ink-2">
                      <span>Clinical Need</span>
                      <span className="text-amber-ink font-medium">Septoplasty &amp; Rhinoplasty</span>
                    </div>
                    <div className="border-t border-line/60 pt-2 flex items-center justify-between text-xs font-mono text-ink-2">
                      <span>Prototyping Grant</span>
                      <span className="text-emerald-700 font-medium">₹15L MSME Idea Hackathon</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-[0.72rem] text-muted font-mono leading-relaxed">
                  Pre-incubation executed 16/01/2024 · Validated on ex-vivo cartilage tissue models with AIIMS Jodhpur ENT teams.
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Supporting Featured Ventures: 3 Balanced Editorial Previews */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* 1. HealYantra Medical Technologies */}
          {healyantra && (
            <article className="rounded-xl border border-line bg-white p-5 sm:p-6 shadow-2xs hover:border-line-strong hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                {/* Real Team / Award Image */}
                <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden bg-mist mb-4 border border-line">
                  <Image
                    src="/images/achievements/medha-2022-varun-khandelwal.jpg"
                    alt="Dr. Varun Khandelwal presenting the HealYantra ultrasound syringe at MEDHA"
                    width={400}
                    height={250}
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="size-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-xs border border-emerald-300 bg-white/95 px-2 py-0.5 font-mono text-[0.66rem] font-medium text-emerald-800 shadow-2xs">
                      Incubated · TRL 6
                    </span>
                  </div>
                </div>

                <div className="font-mono text-[0.68rem] uppercase tracking-wider text-blue font-semibold mb-1">
                  {healyantra.domainSpotlight}
                </div>
                <h3 className="text-lg font-medium text-ink leading-snug">
                  {healyantra.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-ink-2">
                  {healyantra.product.name}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  Ergonomically engineered syringe allowing solo clinicians to simultaneously aspirate, inject, and scan during real-time ultrasound procedures.
                </p>

                {/* Funding Pill */}
                <div className="mt-3.5 inline-flex items-center gap-1 rounded-xs border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-mono text-emerald-800">
                  <Award className="size-3" />
                  <span>TechEx Transfer Hub &amp; MEDHA Winner</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 border-t border-line/60 pt-3 flex items-center justify-between">
                <span className="text-[0.7rem] text-muted font-mono">AIIMS &amp; IITJ Teams</span>
                <Link
                  href={`/startups/${healyantra.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-ink transition-colors"
                >
                  <span>Explore venture</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          )}

          {/* 2. Sarbit Innovations */}
          {sarbit && (
            <article className="rounded-xl border border-line bg-white p-5 sm:p-6 shadow-2xs hover:border-line-strong hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                {/* Visual schematic card */}
                <div className="rounded-md bg-paper border border-line p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-teal-soft border border-teal/30 flex items-center justify-center text-teal-ink">
                      <Activity className="size-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-ink">Bedside Micro-Sensor</span>
                      <span className="font-mono text-[0.66rem] text-teal-ink">Sepsis Biomarker Detection</span>
                    </div>
                  </div>
                  <span className="rounded-xs border border-emerald-300 bg-emerald-50 px-1.5 py-0.2 font-mono text-[0.66rem] text-emerald-800 font-medium">
                    TRL 5
                  </span>
                </div>

                <div className="font-mono text-[0.68rem] uppercase tracking-wider text-blue font-semibold mb-1">
                  {sarbit.domainSpotlight}
                </div>
                <h3 className="text-lg font-medium text-ink leading-snug">
                  {sarbit.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-ink-2">
                  {sarbit.product.name}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  Point-of-care micro-sensor array delivering automated continuous monitoring of physiological sepsis markers directly at patient bedside.
                </p>

                {/* Funding & Patent Pills */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-xs border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-mono text-emerald-800">
                    <Award className="size-3" />
                    <span>₹15L MSME Idea Hackathon 4.0</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xs border border-teal/30 bg-teal-soft px-2 py-0.5 text-[0.68rem] font-mono text-teal-ink">
                    <ShieldCheck className="size-3" />
                    <span>Patent App 202511061615</span>
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 border-t border-line/60 pt-3 flex items-center justify-between">
                <span className="text-[0.7rem] text-muted font-mono">TISC Incubated</span>
                <Link
                  href={`/startups/${sarbit.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-ink transition-colors"
                >
                  <span>Explore venture</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          )}

          {/* 3. Novealthy Innovations */}
          {novealthy && (
            <article className="rounded-xl border border-line bg-white p-5 sm:p-6 shadow-2xs hover:border-line-strong hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                {/* Visual schematic card */}
                <div className="rounded-md bg-paper border border-line p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-blue-soft border border-blue/30 flex items-center justify-center text-blue">
                      <Stethoscope className="size-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-ink">Remote Pathology Kit</span>
                      <span className="font-mono text-[0.66rem] text-blue">IoT Telemetry &amp; Diagnostics</span>
                    </div>
                  </div>
                  <span className="rounded-xs border border-emerald-300 bg-emerald-50 px-1.5 py-0.2 font-mono text-[0.66rem] text-emerald-800 font-medium">
                    TRL 7
                  </span>
                </div>

                <div className="font-mono text-[0.68rem] uppercase tracking-wider text-blue font-semibold mb-1">
                  {novealthy.domainSpotlight}
                </div>
                <h3 className="text-lg font-medium text-ink leading-snug">
                  {novealthy.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-ink-2">
                  {novealthy.product.name}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  Portable diagnostic kit enabling clinical sample processing and digital telemetry directly from patient homes and point-of-care settings.
                </p>

                {/* Stage Pill */}
                <div className="mt-3.5 inline-flex items-center gap-1 rounded-xs border border-purple-200 bg-purple-50 px-2 py-0.5 text-[0.68rem] font-mono text-purple-800">
                  <Sparkles className="size-3" />
                  <span>TRL 7 · Operational Setting Demonstration</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 border-t border-line/60 pt-3 flex items-center justify-between">
                <span className="text-[0.7rem] text-muted font-mono">Faculty-Led (CSE)</span>
                <Link
                  href={`/startups/${novealthy.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:text-ink transition-colors"
                >
                  <span>Explore venture</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
