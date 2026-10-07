import { Startup } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class StartupRepository {
  static async getAll(): Promise<Startup[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.STARTUPS);
        return rows as unknown as Startup[];
      } catch (err) {
        console.error("Failed to fetch startups from Google Sheets:", err);
      }
    }
    return getLocalStore().startups;
  }

  static async getById(recordId: string): Promise<Startup | null> {
    const all = await this.getAll();
    return all.find((s) => s.record_id === recordId) || null;
  }

  static async getByRollNumber(rollNumber: string): Promise<Startup[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((s) => s.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async create(startup: Omit<Startup, "record_id" | "created_at" | "updated_at">): Promise<Startup> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `STU-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newStartup: Startup = {
      ...startup,
      record_id,
      roll_number: startup.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.STARTUPS, newStartup);
      } catch (err) {
        console.error("Failed to append startup to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.startups.unshift(newStartup);
    return newStartup;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.startups.findIndex((s) => s.record_id === recordId);
    if (idx !== -1) {
      store.startups.splice(idx, 1);
      return true;
    }
    return false;
  }
}
