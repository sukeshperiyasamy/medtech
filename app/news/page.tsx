import { PageHeader } from "@/components/layout/PageHeader";
import { NewsSection } from "@/components/news/NewsSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "News & Events",
  "Conferences, admissions and announcements from the Medical Technologies Center, IIT Jodhpur × AIIMS Jodhpur.",
  "/news",
);

export default function NewsPage() {
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "News & events" }]}
        label="News & events"
        title="From the Center."
        intro="Conferences, admissions and announcements from IIT Jodhpur and AIIMS Jodhpur."
      />
      <NewsSection heading={false} />
    </main>
  );
}