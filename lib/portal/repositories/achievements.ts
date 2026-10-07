import { Achievement } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class AchievementRepository {
  static async getAll(): Promise<Achievement[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.ACHIEVEMENTS);
        return rows as unknown as Achievement[];
      } catch (err) {
        console.error("Failed to fetch achievements from Google Sheets:", err);
      }
    }
    return getLocalStore().achievements;
  }

  static async getById(recordId: string): Promise<Achievement | null> {
    const all = await this.getAll();
    return all.find((a) => a.record_id === recordId) || null;
  }

  static async getByRollNumber(rollNumber: string): Promise<Achievement[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((a) => a.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async create(achievement: Omit<Achievement, "record_id" | "created_at" | "updated_at">): Promise<Achievement> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `ACH-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newAchievement: Achievement = {
      ...achievement,
      record_id,
      roll_number: achievement.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.ACHIEVEMENTS, newAchievement);
      } catch (err) {
        console.error("Failed to append achievement to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.achievements.unshift(newAchievement);
    return newAchievement;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.achievements.findIndex((a) => a.record_id === recordId);
    if (idx !== -1) {
      store.achievements.splice(idx, 1);
      return true;
    }
    return false;
  }
}
