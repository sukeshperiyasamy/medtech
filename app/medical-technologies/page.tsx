import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Introduction } from "@/components/about/Introduction";
import { Partnership } from "@/components/about/Partnership";
import { PipelineSection } from "@/components/pipeline/PipelineSection";
import { HomePrograms } from "@/components/home/HomePrograms";
import { PhotoMarquee } from "@/components/gallery/PhotoMarquee";
import { MoreLink } from "@/components/ui/MoreLink";
import { getGallery, getPrograms, getSite, getVerticals } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Medical Technologies Program",
  "The Medical Technologies Program — Master's and PhD programmes offered jointly by IIT Jodhpur and AIIMS Jodhpur to produce deep-tech innovators in medical technologies.",
  "/medical-technologies",
);

export default async function MedicalTechnologiesPage() {
  const [site, programs, verticals, photos] = await Promise.all([
    getSite(),
    getPrograms(),
    getVerticals(),
    getGallery("icmi-2025"),
  ]);
  const program = verticals.find((v) => v.id === "medical-technologies")!;

  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Verticals" }, { label: program.name }]}
        label="Vertical 01 · IIT Jodhpur × AIIMS Jodhpur"
        title={program.name}
        intro={program.tagline}
      >
        <div className="mt-10 flex items-center gap-3">
          {site.institutions.map((inst, i) => (
            <span key={inst.name} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="font-mono text-xs text-muted">×</span>}
              <Image src={inst.logo.src} alt={inst.logo.alt} width={44} height={44} className="h-11 w-auto" style={{ width: "auto", height: "auto" }} />
            </span>
          ))}
          <p className="ml-2 text-sm text-muted">A vertical of the {site.name}, IIT Jodhpur</p>
        </div>
      </PageHeader>

      <Introduction site={site} programs={programs} index="01" />
      <Partnership site={site} index="02" />
      <PipelineSection index="03" />
      <HomePrograms index="04" />

      {photos.length > 0 && (
        <section aria-labelledby="mt-icmi" className="section-y border-t border-line">
          <div className="container-x mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">05 — Indian Conference on MedTech Innovations</p>
              <h2 id="mt-icmi" className="text-h2 max-w-[20ch] text-ink">ICMI — born out of the joint programme.</h2>
            </div>
            <MoreLink href="/news#icmi-2025">ICMI 2025 gallery</MoreLink>
          </div>
          <PhotoMarquee images={photos} title="ICMI 2025" />
        </section>
      )}
    </main>
  );
}
