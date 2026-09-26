import { MoreLink } from "@/components/ui/MoreLink";
import { getFeaturedGalleryImages, getGalleryImages } from "@/lib/data";
import type { GalleryImage } from "@/lib/types";
import { RotatingPhotoGrid } from "./RotatingPhotoGrid";

const slim = ({ id, src, alt, width, height, color }: GalleryImage) => ({ id, src, alt, width, height, color });

/**
 * Homepage gallery teaser: starts with five hand-picked photos (one large, four small),
 * then rotates through the gallery's landscape photographs every five seconds.
 * Every tile links to /gallery.
 */
export async function FromTheGallery() {
  const [featured, all] = await Promise.all([getFeaturedGalleryImages(5), getGalleryImages()]);
  if (!featured.length) return null;
  // Landscape photos crop well into the 4:3 tiles; posters and portraits are left out.
  const pool = all.filter((p) => p.width / p.height >= 1.2).map(slim);
  return (
    <div className="container-x">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">From the gallery</p>
          <p className="mt-2 text-h3 text-ink">Life at the Centre.</p>
        </div>
        <MoreLink href="/gallery">View gallery</MoreLink>
      </div>
      <RotatingPhotoGrid initial={featured.map(slim)} pool={pool} />
    </div>
  );
}
