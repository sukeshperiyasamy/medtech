import { getAchievements } from "@/lib/data";
import { AchievementsSlider } from "./AchievementsSlider";

/** Recent photographed achievements, as a slider at the top of the homepage. */
export async function HomeAchievements() {
  const items = (await getAchievements())
    .filter((a) => a.image)
    .slice(0, 12)
    .map((a) => ({
      id: a.id,
      title: a.shortTitle ?? a.title,
      category: a.category,
      year: a.year,
      recipients: a.recipients.map((r) => r.name).join(", "),
      image: a.image!,
    }));

  if (items.length === 0) return null;
  return <AchievementsSlider items={items} />;
}
