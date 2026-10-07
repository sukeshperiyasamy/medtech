import { Patent } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, updateSheetRowByField, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class PatentRepository {
  static async getAll(): Promise<Patent[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.PATENTS);
        return rows as unknown as Patent[];
      } catch (err) {
        console.error("Failed to fetch patents from Google Sheets:", err);
      }
    }
    return getLocalStore().patents;
  }

  static async getByRollNumber(rollNumber: string): Promise<Patent[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((p) => p.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async getById(recordId: string): Promise<Patent | null> {
    const all = await this.getAll();
    return all.find((p) => p.record_id === recordId) || null;
  }

  static async checkDuplicate(
    rollNumber: string,
    applicationNo: string
  ): Promise<{ isDuplicate: boolean; existingRecord?: Patent }> {
    const cleanApp = applicationNo.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!cleanApp) return { isDuplicate: false };

    const studentPatents = await this.getByRollNumber(rollNumber);
    for (const pat of studentPatents) {
      const existingApp = (pat.application_no || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanApp && existingApp && cleanApp === existingApp) {
        return { isDuplicate: true, existingRecord: pat };
      }
    }
    return { isDuplicate: false };
  }

  static async create(patent: Omit<Patent, "record_id" | "created_at" | "updated_at">): Promise<Patent> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `PAT-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newPatent: Patent = {
      ...patent,
      record_id,
      roll_number: patent.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.PATENTS, newPatent);
      } catch (err) {
        console.error("Failed to append patent to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.patents.unshift(newPatent);
    return newPatent;
  }

  static async update(recordId: string, data: Partial<Patent>): Promise<Patent | null> {
    const timestamp = new Date().toISOString();

    if (isGoogleConfigured()) {
      try {
        await updateSheetRowByField(SHEET_NAMES.PATENTS, "record_id", recordId, {
          ...data,
          updated_at: timestamp,
        });
      } catch (err) {
        console.error("Failed to update patent in Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    const idx = store.patents.findIndex((p) => p.record_id === recordId);
    if (idx !== -1) {
      store.patents[idx] = {
        ...store.patents[idx],
        ...data,
        updated_at: timestamp,
      };
      return store.patents[idx];
    }
    return null;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.patents.findIndex((p) => p.record_id === recordId);
    if (idx !== -1) {
      store.patents.splice(idx, 1);
      return true;
    }
    return false;
  }
}
