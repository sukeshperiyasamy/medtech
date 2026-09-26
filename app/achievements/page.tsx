import { PageHeader } from "@/components/layout/PageHeader";
import {
  AchievementsList,
  type ResolvedAchievement,
} from "@/components/achievements/AchievementsList";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAchievements, getAllPrograms, getPeopleByIds, getSite, getStudents } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { achievementsLd } from "@/lib/structured-data";

export const metadata = pageMetadata(
  "Achievements",
  "Medals, fellowships and awards earned by the students and faculty of the Medical Technology Centre, IIT Jodhpur.",
  "/achievements",
);

export default async function AchievementsPage() {
  const [achievements, students, programs, site] = await Promise.all([
    getAchievements(),
    getStudents(),
    getAllPrograms(),
    getSite(),
  ]);

  // Resolve each recipient to their programme and cohort (students) or designation (faculty).
  const items: ResolvedAchievement[] = await Promise.all(
    achievements.map(async (a) => ({
      ...a,
      people: await Promise.all(
        a.recipients.map(async (r) => {
          if (r.studentId) {
            const s = students.find((x) => x.id === r.studentId);
            const prog = s && programs.find((p) => p.id === s.programId);
            return {
              name: r.name,
              context: s && prog ? `${prog.shortTitle}, admitted ${s.cohortYear}` : undefined,
            };
          }
          if (r.personId) {
            const [p] = await getPeopleByIds([r.personId]);
            return { name: r.name, context: p?.designation };
          }
          return { name: r.name };
        }),
      ),
    })),
  );

  return (
    <main id="main">
      <JsonLd data={achievementsLd(achievements, site)} />
      <PageHeader
        crumbs={[{ label: "People", href: "/people" }, { label: "Achievements" }]}
        label="Achievements"
        title="Recognised for their work."
        intro="Medals, fellowships and awards earned by the Centre's students and faculty."
      />
      <section aria-label="Achievements" className="container-x pb-24 pt-12 lg:pb-32 lg:pt-16">
        {items.length ? (
          <AchievementsList items={items} />
        ) : (
          <EmptyState
            title="Achievements will be listed here."
            body="Medals, fellowships and awards will appear once confirmed."
          />
        )}
        <div className="mt-16 grid gap-4 border border-line bg-paper p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-lg font-medium text-ink">Have an achievement to add?</p>
            <p className="mt-1 max-w-2xl text-[0.95rem] text-muted">
              Students, alumni and faculty: send the award, the awarding body, the date and the
              official certificate, letter or announcement.
            </p>
          </div>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Achievement to add")}`}
            className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-[0.92rem] font-medium text-white transition-colors hover:bg-blue"
          >
            Submit an achievement
          </a>
        </div>
      </section>
    </main>
  );
}
