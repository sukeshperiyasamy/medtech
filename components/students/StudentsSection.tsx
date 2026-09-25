import { ArrowUpRight } from "lucide-react";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { getAllPrograms, getSite, getStudents } from "@/lib/data";
import { StudentRegister } from "./StudentRegister";

export async function StudentsSection({ index, heading = true }: SectionProps = {}) {
  const [students, programs, site] = await Promise.all([getStudents(), getAllPrograms(), getSite()]);
  const years = students.map((s) => s.cohortYear);
  // Programme status belongs to the programme, never next to a student's name.
  const meta = programs.map((p) => ({
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
        <div className="mt-14 lg:mt-20">
          <StudentRegister students={students} programs={meta} />
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
