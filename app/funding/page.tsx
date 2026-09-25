import { PageHeader } from "@/components/layout/PageHeader";
import { FundingSection } from "@/components/funding/FundingSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Funding & Grants",
  "Grants and funding opportunities for medical technology researchers, innovators and industry partners.",
  "/funding",
);

export default function FundingPage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "Research", href: "/research" }, { label: "Funding" }]}
        label="Funding & grants"
        title="Funding the next generation of medical technologies."
        intro="Government schemes, biotech and deep-tech programmes, start-up support and industry-sponsored research — in one place."
      />
      <FundingSection heading={false} />
    </main>
  );
}