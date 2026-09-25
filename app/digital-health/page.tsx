import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { DigitalHealthSections } from "@/components/digital-health/DigitalHealthSections";
import { getDigitalHealth, getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Centre for Digital Health",
  "The Centre for Digital Health at IIT Jodhpur — health equity through digital transformation: research, capacity-building programmes, open-source health data and partnerships.",
  "/digital-health",
);

export default async function DigitalHealthPage() {
  const [cdh, site] = await Promise.all([getDigitalHealth(), getSite()]);
  const iitj = site.institutions[0];
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Verticals" }, { label: "Centre for Digital Health" }]}
        label="Vertical 02 · IIT Jodhpur"
        title="Centre for Digital Health"
        intro={cdh.tagline}
      >
        <div className="mt-10 flex items-center gap-3">
          <Image src={iitj.logo.src} alt={iitj.logo.alt} width={40} height={44} className="h-11 w-auto" style={{ width: "auto", height: "auto" }} />
          <p className="text-sm text-muted">A vertical of the {site.name}, IIT Jodhpur</p>
        </div>
      </PageHeader>
      <DigitalHealthSections cdh={cdh} />
    </main>
  );
}
