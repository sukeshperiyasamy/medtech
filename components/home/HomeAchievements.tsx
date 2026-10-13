import { getAchievements, getCentrePhoto } from "@/lib/data";
import { gallery } from "@/data/media";
import { AchievementsSlider, type AchievementSlide } from "./AchievementsSlider";

/** Strict landscape verification: width must be greater than height (width > height). */
const isLandscape = (w?: number, h?: number): boolean => {
  return typeof w === "number" && typeof h === "number" && w > 0 && h > 0 && w > h;
};

/** High-impact landscape photographs of the Centre, milestones, and innovations. */
export async function HomeAchievements() {
  const [allAchievements, centre] = await Promise.all([
    getAchievements(),
    getCentrePhoto(),
  ]);

  const slides: AchievementSlide[] = [];
  const seenSrc = new Set<string>();

  // 1. Highlight the Centre's building & campus landmark (if verified landscape)
  if (centre && isLandscape(centre.width || 1448, centre.height || 1086)) {
    const src = centre.src;
    if (!seenSrc.has(src)) {
      seenSrc.add(src);
      slides.push({
        id: "centre-campus",
        image: {
          src,
          alt: centre.alt,
          width: centre.width || 1448,
          height: centre.height || 1086,
        },
        title: "Medical Technology Centre, IIT Jodhpur",
        shortTitle: "IIT Jodhpur × AIIMS Jodhpur",
        category: "Campus & Centre",
        awardedBy: "W16 Berm, IIT Jodhpur",
        year: 2026,
        summary:
          "A joint initiative between IIT Jodhpur and AIIMS Jodhpur advancing medical engineering and clinical innovation.",
      });
    }
  }

  // 2. Curate verified landscape-oriented achievement photographs (width > height)
  const landscapeAchievements = allAchievements.filter(
    (a) => a.image && isLandscape(a.image.width, a.image.height),
  );

  for (const a of landscapeAchievements) {
    if (a.image && !seenSrc.has(a.image.src)) {
      seenSrc.add(a.image.src);
      slides.push({
        id: a.id,
        image: a.image,
        title: a.title,
        shortTitle: a.shortTitle,
        category: a.category,
        awardedBy: a.awardedBy,
        year: a.year,
        date: a.date,
        summary: a.summary,
        recipients: a.recipients,
      });
    }
  }

  // 3. Add verified landscape ICMI conference highlights (width > height)
  const landscapeGallery = gallery.filter((g) => isLandscape(g.width, g.height));
  for (const g of landscapeGallery.slice(0, 4)) {
    if (!seenSrc.has(g.src)) {
      seenSrc.add(g.src);
      slides.push({
        id: g.id,
        image: {
          src: g.src,
          alt: g.alt,
          width: g.width,
          height: g.height,
        },
        title: g.caption,
        shortTitle: "ICMI 2025",
        category: "National Conference",
        awardedBy: "Indian Conference on MedTech Innovations",
        year: 2025,
        summary: g.alt,
      });
    }
  }

  if (slides.length === 0) return null;
  return <AchievementsSlider items={slides} />;
}

