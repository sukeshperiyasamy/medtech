import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { getAchievements, getAllPrograms, getSite, getStudents } from "@/lib/data";
import { StudentRegister } from "./StudentRegister";

export async function StudentsSection({ index, heading = true }: SectionProps = {}) {
  const [students, programs, site, achievements] = await Promise.all([
    getStudents(),
    getAllPrograms(),
    getSite(),
    getAchievements(),
  ]);
  // studentId → short award labels, e.g. "Silver Medal 2024"
  const awards: Record<string, string[]> = {};
  for (const a of achievements)
    for (const r of a.recipients)
      if (r.studentId) (awards[r.studentId] ??= []).push(`${(a.shortTitle ?? a.title).replace(/ \d{4}$/, "")} ${a.year}`);
  const years = students.map((s) => s.cohortYear);
  // Programme status belongs to the programme, never next to a student's name.
  const meta = programs.filter((p) => students.some((s) => s.programId === p.id)).map((p) => ({
    id: p.id,
    label: p.shortTitle,
    note:
      p.availability === "discontinued"
        ? `The ${p.shortTitle} programme is no longer offered${p.intakeYears ? ` — intakes ${p.intakeYears}` : ""}.`
        : undefined,
  }));

  return (
    <section id="students" aria-labelledby={heading ? "students-title" : undefined} className="section-y border-t border-line">
      <div className="container-x">
        {heading && (
        <SectionHeading
          id="students-title"
          index={index}
          label="Students & alumni"
          title="The people the programme was built for."
          intro={`${students.length} medical and engineering graduates admitted across the Master's, PhD and Dual Degree programmes since ${Math.min(...years)} — listed by cohort, as published by IIT Jodhpur.`}
        />
        )}

        {/* Brochure Data Portal Notice */}
        <div className="mt-8 p-5 sm:p-6 rounded-sm border border-blue/20 bg-blue-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1 sm:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                2026 Centre Brochure Data Collection Notice
              </p>
              <p className="text-xs text-muted mt-0.5 max-w-2xl">
                Are you listed in any cohort below? Access the portal with your roll number to review your profile and submit your journal papers, patent applications, clinical internships, and ventures.
              </p>
            </div>
          </div>
          <Link
            href="/portal"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-blue px-4 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shrink-0"
          >
            <span>Open Student Portal</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-12 lg:mt-16">
          <StudentRegister students={students} programs={meta} awards={awards} />
        </div>

        <div className="mt-14 grid gap-6 border border-line bg-paper p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-lg font-medium text-ink">Alumni — where are you now?</p>
            <p className="mt-1 max-w-2xl text-[0.95rem] text-muted">
              Share your current role, research or startup and a photo, and we&rsquo;ll add an alumni
              profile to the register.
            </p>
          </div>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Alumni profile update")}`}
            className="group inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 text-[0.92rem] font-medium text-white transition-colors hover:bg-blue"
          >
            Update your profile
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
