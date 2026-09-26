import Image from "next/image";
import Link from "next/link";
import { MoreLink } from "@/components/ui/MoreLink";
import { getFeaturedGalleryImages } from "@/lib/data";

/**
 * Homepage teaser: five hand-picked photos (one large, four small), linking to /gallery.
 * Only these five load on the homepage.
 */
export async function FromTheGallery() {
  const photos = await getFeaturedGalleryImages(5);
  if (!photos.length) return null;
  return (
    <div className="container-x mt-20 lg:mt-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">From the gallery</p>
          <p className="mt-2 text-h3 text-ink">Life at the Centre.</p>
        </div>
        <MoreLink href="/gallery">View gallery</MoreLink>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <Link prefetch={false}
              href="/gallery"
              className="group relative block h-full overflow-hidden border border-line"
              style={{ backgroundColor: p.color }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="aspect-[4/3] size-full object-cover transition-[transform,filter] duration-700 ease-[var(--ease-precise)] group-hover:scale-[1.015] group-hover:brightness-[0.92]"
              />
              <span className="sr-only">Open the gallery</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
