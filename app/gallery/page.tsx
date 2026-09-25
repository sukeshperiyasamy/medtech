import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Gallery",
  "Moments from research, learning, events and life at the Medical Technology Centre, IIT Jodhpur.",
  "/gallery",
);

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <main id="main">
      <PageHeader
        crumbs={[{ label: "News", href: "/news" }, { label: "Gallery" }]}
        label="Gallery"
        title="Gallery"
        intro="Moments from research, learning, events and life at the Medical Technology Centre."
      />
      <section aria-label="Photo gallery" className="container-x pb-24 pt-10 lg:pb-32 lg:pt-14">
        <GalleryGrid images={images} />
      </section>
    </main>
  );
}
