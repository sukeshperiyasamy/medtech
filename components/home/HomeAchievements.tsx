import { getAchievements, getCentrePhoto } from "@/lib/data";
import { gallery } from "@/data/media";
import { AchievementsSlider } from "./AchievementsSlider";

/** High-impact landscape photographs of the Centre, milestones, and innovations. */
export async function HomeAchievements() {
  const [allAchievements, centre] = await Promise.all([
    getAchievements(),
    getCentrePhoto(),
  ]);

  // Curate landscape-oriented photos (aspect ratio >= 1.05) to ensure full-bleed coverage with zero letterboxing
  const wideAchievements = allAchievements
    .filter((a) => a.image && (a.image.width || 0) / (a.image.height || 1) >= 1.05)
    .map((a) => ({
      id: a.id,
      image: a.image!,
      title: a.title,
      shortTitle: a.shortTitle,
      category: a.category,
      awardedBy: a.awardedBy,
      year: a.year,
      date: a.date,
      summary: a.summary,
      recipients: a.recipients,
    }));

  // Highlight the Centre's building & campus landmark
  const centreItem = {
    id: "centre-campus",
    image: {
      src: centre.src,
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
  };

  // Add top ICMI conference landscape highlights
  const icmiHighlights = gallery
    .filter((g) => g.width >= g.height)
    .slice(0, 3)
    .map((g) => ({
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
    }));

  const items = [centreItem, ...wideAchievements, ...icmiHighlights];

  if (items.length === 0) return null;
  return <AchievementsSlider items={items} />;
}
