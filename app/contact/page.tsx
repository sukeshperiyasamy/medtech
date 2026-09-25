import { PageHeader } from "@/components/layout/PageHeader";
import { CollaborationSection } from "@/components/collaboration/CollaborationSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Contact & Collaborate",
  "Contact the Medical Technologies Center — collaborative research, clinical needs, industry partnerships, translation and funding.",
  "/contact",
);

export default function ContactPage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        label="Contact & collaborate"
        title="Build the future of healthcare with us."
        intro="Five ways in — whichever side of the clinic, lab or market you are coming from."
      />
      <CollaborationSection heading={false} />
    </main>
  );
}