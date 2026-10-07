import { DocumentRecord } from "@/types";
import { isGoogleConfigured } from "@/lib/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/google/sheets";
import { getLocalStore } from "./store";

export class DocumentRepository {
  static async getAll(): Promise<DocumentRecord[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.DOCUMENTS);
        return rows as unknown as DocumentRecord[];
      } catch (err) {
        console.error("Failed to fetch documents from Google Sheets:", err);
      }
    }
    return getLocalStore().documents;
  }

  static async getByRollNumber(rollNumber: string): Promise<DocumentRecord[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((d) => d.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async create(doc: Omit<DocumentRecord, "document_id" | "uploaded_at">): Promise<DocumentRecord> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const document_id = `DOC-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newDoc: DocumentRecord = {
      ...doc,
      document_id,
      roll_number: doc.roll_number.trim().toUpperCase(),
      uploaded_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.DOCUMENTS, newDoc);
      } catch (err) {
        console.error("Failed to append document record to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.documents.unshift(newDoc);
    return newDoc;
  }

  static async delete(documentId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.documents.findIndex((d) => d.document_id === documentId);
    if (idx !== -1) {
      store.documents.splice(idx, 1);
      return true;
    }
    return false;
  }
}
