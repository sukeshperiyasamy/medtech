import { Student } from "@/types";
import { isGoogleConfigured } from "@/lib/google/auth";
import { fetchSheetRows, updateSheetRowByField, appendSheetRow, SHEET_NAMES } from "@/lib/google/sheets";
import { getLocalStore } from "./store";

export class StudentRepository {
  static async getAll(): Promise<Student[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.STUDENTS);
        return rows as Student[];
      } catch (err) {
        console.error("Google Sheets getAll students error, falling back to local store:", err);
      }
    }
    return getLocalStore().students;
  }

  static async getByRollNumber(rollNumber: string): Promise<Student | null> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const students = await this.getAll();
    return (
      students.find((s) => s.roll_number.trim().toUpperCase() === cleanRoll) || null
    );
  }

  static async search(query: string): Promise<Student[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const students = await this.getAll();
    return students.filter((s) => {
      const roll = (s.roll_number || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      const degree = (s.degree || "").toLowerCase();

      return (
        roll.includes(q) ||
        name.includes(q) ||
        email.includes(q) ||
        degree.includes(q)
      );
    });
  }

  static async update(
    rollNumber: string,
    data: Partial<Student>
  ): Promise<Student | null> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const updated_at = new Date().toISOString();

    if (isGoogleConfigured()) {
      try {
        const success = await updateSheetRowByField(
          SHEET_NAMES.STUDENTS,
          "roll_number",
          cleanRoll,
          { ...data, updated_at }
        );
        if (success) {
          const fresh = await this.getByRollNumber(cleanRoll);
          return fresh;
        }
      } catch (err) {
        console.error("Failed to update student in Google Sheets:", err);
      }
    }

    // Local Store update
    const store = getLocalStore();
    const idx = store.students.findIndex(
      (s) => s.roll_number.trim().toUpperCase() === cleanRoll
    );
    if (idx !== -1) {
      store.students[idx] = {
        ...store.students[idx],
        ...data,
        updated_at,
      };
      return store.students[idx];
    }
    return null;
  }

  static async create(student: Student): Promise<Student> {
    const cleanRoll = student.roll_number.trim().toUpperCase();
    const studentRecord: Student = {
      ...student,
      student_id: cleanRoll,
      roll_number: cleanRoll,
      updated_at: new Date().toISOString(),
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.STUDENTS, studentRecord);
      } catch (err) {
        console.error("Failed to append student to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    const exists = store.students.some(
      (s) => s.roll_number.trim().toUpperCase() === cleanRoll
    );
    if (!exists) {
      store.students.push(studentRecord);
    }
    return studentRecord;
  }
}
