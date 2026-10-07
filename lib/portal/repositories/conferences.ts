import { Conference } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class ConferenceRepository {
  static async getAll(): Promise<Conference[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.CONFERENCES);
        return rows as unknown as Conference[];
      } catch (err) {
        console.error("Failed to fetch conferences from Google Sheets:", err);
      }
    }
    return getLocalStore().conferences;
  }

  static async getById(recordId: string): Promise<Conference | null> {
    const all = await this.getAll();
    return all.find((c) => c.record_id === recordId) || null;
  }

  static async getByRollNumber(rollNumber: string): Promise<Conference[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((c) => c.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async create(conf: Omit<Conference, "record_id" | "created_at" | "updated_at">): Promise<Conference> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `CNF-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newConf: Conference = {
      ...conf,
      record_id,
      roll_number: conf.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.CONFERENCES, newConf);
      } catch (err) {
        console.error("Failed to append conference to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.conferences.unshift(newConf);
    return newConf;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.conferences.findIndex((c) => c.record_id === recordId);
    if (idx !== -1) {
      store.conferences.splice(idx, 1);
      return true;
    }
    return false;
  }
}
