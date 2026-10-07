import { getAchievements } from "@/lib/data";
import { AchievementsSlider } from "./AchievementsSlider";

/** Recent achievement photographs, as a large image-only slider. */
export async function HomeAchievements() {
  const items = (await getAchievements())
    .filter((a) => a.image)
    .slice(0, 12)
    .map((a) => ({ id: a.id, image: a.image! }));

  if (items.length === 0) return null;
  return <AchievementsSlider items={items} />;
}
