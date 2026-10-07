import { Publication } from "@/types";
import { isGoogleConfigured } from "@/lib/google/auth";
import { fetchSheetRows, appendSheetRow, updateSheetRowByField, SHEET_NAMES } from "@/lib/google/sheets";
import { getLocalStore } from "./store";

export class PublicationRepository {
  static async getAll(): Promise<Publication[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.PUBLICATIONS);
        return rows as unknown as Publication[];
      } catch (err) {
        console.error("Failed to fetch publications from Google Sheets:", err);
      }
    }
    return getLocalStore().publications;
  }

  static async getByRollNumber(rollNumber: string): Promise<Publication[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((p) => p.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async getById(recordId: string): Promise<Publication | null> {
    const all = await this.getAll();
    return all.find((p) => p.record_id === recordId) || null;
  }

  /**
   * Duplicate check according to spec:
   * 1. Roll Number + DOI
   * 2. If DOI absent: Roll Number + Title (case-insensitive) + Year
   */
  static async checkDuplicate(
    rollNumber: string,
    title: string,
    doi?: string,
    publicationDate?: string
  ): Promise<{ isDuplicate: boolean; existingRecord?: Publication }> {
    const studentPubs = await this.getByRollNumber(rollNumber);
    const cleanDoi = (doi || "").trim().toLowerCase();
    const cleanTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const year = publicationDate ? publicationDate.slice(0, 4) : "";

    for (const pub of studentPubs) {
      // Check 1: DOI match
      if (cleanDoi && cleanDoi.length > 5) {
        const existingDoi = (pub.doi || "").trim().toLowerCase();
        if (existingDoi === cleanDoi) {
          return { isDuplicate: true, existingRecord: pub };
        }
      }

      // Check 2: Title & Year match
      const existingTitle = (pub.title || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      const existingYear = pub.publication_date ? pub.publication_date.slice(0, 4) : "";

      if (cleanTitle && existingTitle && cleanTitle === existingTitle) {
        if (!year || !existingYear || year === existingYear) {
          return { isDuplicate: true, existingRecord: pub };
        }
      }
    }

    return { isDuplicate: false };
  }

  static async create(pub: Omit<Publication, "record_id" | "created_at" | "updated_at">): Promise<Publication> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `PUB-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newPub: Publication = {
      ...pub,
      record_id,
      roll_number: pub.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.PUBLICATIONS, newPub);
      } catch (err) {
        console.error("Failed to append publication to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.publications.unshift(newPub);

    return newPub;
  }

  static async update(recordId: string, data: Partial<Publication>): Promise<Publication | null> {
    const timestamp = new Date().toISOString();

    if (isGoogleConfigured()) {
      try {
        await updateSheetRowByField(SHEET_NAMES.PUBLICATIONS, "record_id", recordId, {
          ...data,
          updated_at: timestamp,
        });
      } catch (err) {
        console.error("Failed to update publication in Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    const idx = store.publications.findIndex((p) => p.record_id === recordId);
    if (idx !== -1) {
      store.publications[idx] = {
        ...store.publications[idx],
        ...data,
        updated_at: timestamp,
      };
      return store.publications[idx];
    }
    return null;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.publications.findIndex((p) => p.record_id === recordId);
    if (idx !== -1) {
      store.publications.splice(idx, 1);
      return true;
    }
    return false;
  }
}
