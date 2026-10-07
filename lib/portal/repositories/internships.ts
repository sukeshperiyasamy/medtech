import { Internship } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class InternshipRepository {
  static async getAll(): Promise<Internship[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.INTERNSHIPS);
        return rows as unknown as Internship[];
      } catch (err) {
        console.error("Failed to fetch internships from Google Sheets:", err);
      }
    }
    return getLocalStore().internships;
  }

  static async getById(recordId: string): Promise<Internship | null> {
    const all = await this.getAll();
    return all.find((i) => i.record_id === recordId) || null;
  }

  static async getByRollNumber(rollNumber: string): Promise<Internship[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((i) => i.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async checkDuplicate(
    rollNumber: string,
    organization: string,
    startDate: string
  ): Promise<{ isDuplicate: boolean; existingRecord?: Internship }> {
    const cleanOrg = organization.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanDate = (startDate || "").slice(0, 10);
    const studentInternships = await this.getByRollNumber(rollNumber);

    for (const item of studentInternships) {
      const existingOrg = (item.organization || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const existingDate = (item.start_date || "").slice(0, 10);
      if (cleanOrg && existingOrg && cleanOrg === existingOrg && cleanDate === existingDate) {
        return { isDuplicate: true, existingRecord: item };
      }
    }
    return { isDuplicate: false };
  }

  static async create(internship: Omit<Internship, "record_id" | "created_at" | "updated_at">): Promise<Internship> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `INT-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newInternship: Internship = {
      ...internship,
      record_id,
      roll_number: internship.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.INTERNSHIPS, newInternship);
      } catch (err) {
        console.error("Failed to append internship to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.internships.unshift(newInternship);
    return newInternship;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.internships.findIndex((i) => i.record_id === recordId);
    if (idx !== -1) {
      store.internships.splice(idx, 1);
      return true;
    }
    return false;
  }
}
