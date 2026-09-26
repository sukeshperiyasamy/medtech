import { PageHeader } from "@/components/layout/PageHeader";
import { NewsSection } from "@/components/news/NewsSection";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { eventLd } from "@/lib/structured-data";
import { getNews } from "@/lib/data";

export const metadata = pageMetadata(
  "News & Events",
  "Conferences, admissions and announcements from the Medical Technology Centre, IIT Jodhpur × AIIMS Jodhpur.",
  "/news",
);

export default async function NewsPage() {
  const news = await getNews();
  return (
    <main id="main">
      <JsonLd data={news.map(eventLd)} />
      <PageHeader
        crumbs={[{ label: "News & events" }]}
        label="News & events"
        title="From the Centre."
        intro="Conferences, admissions and announcements from IIT Jodhpur and AIIMS Jodhpur."
      />
      <NewsSection heading={false} />
    </main>
  );
}
