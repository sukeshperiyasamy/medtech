import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";

export const SHEET_NAMES = {
  STUDENTS: "Students",
  PUBLICATIONS: "Publications",
  PATENTS: "Patents",
  PROJECTS: "Projects",
  INTERNSHIPS: "Internships",
  ACHIEVEMENTS: "Achievements",
  CONFERENCES: "Conferences",
  STARTUPS: "Startups",
  DOCUMENTS: "Documents",
  AUDIT_LOG: "Audit_Log",
} as const;

export const SHEET_COLUMNS: Record<string, string[]> = {
  Students: [
    "student_id",
    "roll_number",
    "name",
    "email",
    "phone",
    "date_of_birth",
    "gender",
    "degree",
    "department",
    "batch",
    "specialization",
    "graduation_year",
    "supervisor",
    "address",
    "city",
    "state",
    "pincode",
    "status",
    "updated_at",
  ],
  Publications: [
    "record_id",
    "roll_number",
    "title",
    "authors",
    "journal_conference",
    "publication_type",
    "doi",
    "publisher",
    "publication_date",
    "volume",
    "issue",
    "pages",
    "url",
    "student_contribution",
    "status",
    "document_url",
    "drive_file_id",
    "created_at",
  ],
  Patents: [
    "record_id",
    "roll_number",
    "title",
    "inventors",
    "application_no",
    "patent_no",
    "filing_date",
    "publication_date",
    "patent_type",
    "patent_office",
    "status",
    "applicant_organization",
    "patent_url",
    "document_url",
    "drive_file_id",
    "created_at",
  ],
  Projects: [
    "record_id",
    "roll_number",
    "title",
    "project_type",
    "description",
    "supervisor",
    "organization",
    "start_date",
    "end_date",
    "technologies",
    "status",
    "project_url",
    "document_url",
    "drive_file_id",
    "created_at",
  ],
  Internships: [
    "record_id",
    "roll_number",
    "organization",
    "role",
    "internship_type",
    "start_date",
    "end_date",
    "description",
    "technologies",
    "supervisor",
    "location",
    "status",
    "certificate_url",
    "offer_letter_url",
    "created_at",
  ],
  Achievements: [
    "record_id",
    "roll_number",
    "title",
    "category",
    "organization",
    "date",
    "description",
    "position_rank",
    "url",
    "proof_url",
    "created_at",
  ],
  Conferences: [
    "record_id",
    "roll_number",
    "conference_name",
    "conference_type",
    "location",
    "date",
    "participation_type",
    "paper_presented",
    "presentation_title",
    "organizer",
    "url",
    "certificate_url",
    "created_at",
  ],
  Startups: [
    "record_id",
    "roll_number",
    "startup_name",
    "founder_role",
    "cofounders",
    "domain",
    "description",
    "founded_year",
    "website",
    "current_status",
    "incubator",
    "funding",
    "document_url",
    "created_at",
  ],
  Documents: [
    "document_id",
    "roll_number",
    "record_id",
    "category",
    "original_filename",
    "generated_filename",
    "file_type",
    "file_size",
    "drive_file_id",
    "drive_url",
    "uploaded_at",
  ],
  Audit_Log: [
    "log_id",
    "timestamp",
    "user",
    "roll_number",
    "action",
    "module",
    "record_id",
    "status",
    "description",
  ],
};

function getSheetsService() {
  const auth = getGoogleAuthClient();
  return google.sheets({ version: "v4", auth });
}

export async function fetchSheetRows(sheetName: string): Promise<Record<string, any>[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not configured");

  const sheets = getSheetsService();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z`,
  });

  const rows = response.data.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0].map((h: string) => String(h).trim());
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const record: Record<string, any> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] !== undefined ? row[index] : "";
    });
    return record;
  });
}

export async function appendSheetRow(sheetName: string, rowData: Record<string, any>): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not configured");

  const sheets = getSheetsService();
  const expectedCols = SHEET_COLUMNS[sheetName] || Object.keys(rowData);
  const values = expectedCols.map((col) => {
    const val = rowData[col];
    return val !== undefined && val !== null ? String(val) : "";
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}

export async function updateSheetRowByField(
  sheetName: string,
  fieldToMatch: string,
  valueToMatch: string,
  updatedData: Record<string, any>
): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not configured");

  const sheets = getSheetsService();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z`,
  });

  const rows = response.data.values || [];
  if (rows.length < 2) return false;

  const headers = rows[0].map((h: string) => String(h).trim());
  const matchIndex = headers.indexOf(fieldToMatch);
  if (matchIndex === -1) return false;

  const rowIndex = rows.findIndex(
    (row, idx) => idx > 0 && String(row[matchIndex]).trim().toLowerCase() === valueToMatch.trim().toLowerCase()
  );

  if (rowIndex === -1) return false;

  const targetRow = rows[rowIndex];
  const newRow = headers.map((header, idx) => {
    if (updatedData[header] !== undefined) {
      return String(updatedData[header]);
    }
    return targetRow[idx] !== undefined ? targetRow[idx] : "";
  });

  const rowNumber = rowIndex + 1; // 1-based index
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A${rowNumber}:Z${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [newRow],
    },
  });

  return true;
}

export async function ensureSpreadsheetTabs(): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) return;

  const sheets = getSheetsService();
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existingSheetTitles = new Set(meta.data.sheets?.map((s) => s.properties?.title) || []);

  const addRequests: any[] = [];
  for (const [title, cols] of Object.entries(SHEET_COLUMNS)) {
    if (!existingSheetTitles.has(title)) {
      addRequests.push({
        addSheet: {
          properties: { title },
        },
      });
    }
  }

  if (addRequests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: addRequests },
    });

    // Write header rows for new sheets
    for (const [title, cols] of Object.entries(SHEET_COLUMNS)) {
      if (!existingSheetTitles.has(title)) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${title}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [cols],
          },
        });
      }
    }
  }
}
