import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Profile, type ResolvedStartup } from "@/components/startups/StartupShowcase";
import { MoreLink } from "@/components/ui/MoreLink";
import {
  getPeopleByIds,
  getResearchAreas,
  getSite,
  getStartup,
  getStartups,
  getTrlScale,
} from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { startupLd } from "@/lib/structured-data";

export async function generateStaticParams() {
  return (await getStartups()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const s = await getStartup((await params).slug);
  return s ? pageMetadata(s.name, `${s.name} — ${s.tagline}.`, `/startups/${s.slug}`) : {};
}

export default async function StartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getStartup((await params).slug);
  if (!s) notFound();
  const [areas, scale, site] = await Promise.all([getResearchAreas(), getTrlScale(), getSite()]);
  const resolved: ResolvedStartup = {
    ...s,
    areaTitle: areas.find((a) => a.id === s.researchAreaId)?.shortTitle,
    mentors: (await getPeopleByIds(s.mentorIds)).map(({ id, name, designation }) => ({
      id,
      name,
      designation,
    })),
  };

  return (
    <main id="main">
      <JsonLd data={startupLd(s, site)} />
      <PageHeader
        crumbs={[{ label: "Startups", href: "/startups" }, { label: s.name }]}
        label="Venture profile"
        title={s.name}
        intro={s.tagline}
      />
      <div className="container-x section-y !pt-12">
        <div className="mx-auto max-w-5xl">
          <Profile s={resolved} scale={scale} />
          <MoreLink href="/startups" className="mt-10">
            All ventures
          </MoreLink>
        </div>
      </div>
    </main>
  );
}
