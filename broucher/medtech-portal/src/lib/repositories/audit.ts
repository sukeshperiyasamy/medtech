import { AuditLog, AuditAction } from "@/types";
import { isGoogleConfigured } from "@/lib/google/auth";
import { fetchSheetRows, appendSheetRow, SHEET_NAMES } from "@/lib/google/sheets";
import { getLocalStore } from "./store";

export class AuditRepository {
  static async getAll(): Promise<AuditLog[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.AUDIT_LOG);
        return rows as unknown as AuditLog[];
      } catch (err) {
        console.error("Failed to fetch audit logs from Google Sheets:", err);
      }
    }
    return getLocalStore().audit_logs;
  }

  static async log(entry: {
    user: string;
    roll_number: string;
    action: AuditAction;
    module: string;
    record_id: string;
    status: "SUCCESS" | "FAILED" | "WARNING";
    description: string;
  }): Promise<AuditLog> {
    const store = getLocalStore();
    const nextNum = store.audit_logs.length + 1;
    const log_id = `LOG-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newLog: AuditLog = {
      log_id,
      timestamp,
      user: entry.user || "system",
      roll_number: (entry.roll_number || "N/A").trim().toUpperCase(),
      action: entry.action,
      module: entry.module,
      record_id: entry.record_id,
      status: entry.status,
      description: entry.description,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.AUDIT_LOG, newLog);
      } catch (err) {
        console.error("Failed to append audit log to Google Sheets:", err);
      }
    }

    store.audit_logs.unshift(newLog);
    return newLog;
  }
}
