import Link from "next/link";
import { SectionHeading, type SectionProps } from "@/components/ui/SectionHeading";
import { getAllPrograms } from "@/lib/data";
import { ProgramTabs } from "./ProgramTabs";

export async function ProgramsSection({ index, heading = true }: SectionProps = {}) {
  const all = await getAllPrograms();
  const offered = all.filter((p) => p.availability === "offered");
  const discontinued = all.filter((p) => p.availability === "discontinued");

  return (
    <section
      id="programs"
      aria-labelledby={heading ? "programs-title" : undefined}
      className="section-y border-t border-line"
    >
      <div className="container-x">
        {heading && (
          <SectionHeading
            id="programs-title"
            index={index}
            label="Programmes"
            title="Doctors and engineers, in the same classroom."
            intro="Jointly offered by IIT Jodhpur and AIIMS Jodhpur, with an equal number of seats for medical and engineering graduates."
          />
        )}
        <div className={heading ? "mt-14 lg:mt-20" : ""}>
          <ProgramTabs programs={offered} />
        </div>

        {discontinued.length > 0 && (
          <aside
            aria-labelledby="discontinued-title"
            className="mt-20 border-t border-line pt-8 lg:grid lg:grid-cols-12 lg:gap-12"
          >
            <p id="discontinued-title" className="eyebrow lg:col-span-4">
              Discontinued programmes
            </p>
            <ul className="mt-4 space-y-6 lg:col-span-8 lg:mt-0">
              {discontinued.map((p) => (
                <li key={p.id} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-8">
                  <div>
                    <p className="text-[1.1rem] text-ink">
                      {p.title}
                      {p.intakeYears && (
                        <span className="ml-3 font-mono text-xs text-muted">Admitted {p.intakeYears}</span>
                      )}
                    </p>
                    <p className="mt-1 max-w-2xl text-[0.93rem] text-muted">{p.overview}</p>
                  </div>
                  <Link href="/students" className="link-line self-start text-sm font-medium text-ink hover:text-blue">
                    View cohorts
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
