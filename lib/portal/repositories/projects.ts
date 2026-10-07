import { Project } from "@/lib/portal/types";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { fetchSheetRows, appendSheetRow, updateSheetRowByField, SHEET_NAMES } from "@/lib/portal/google/sheets";
import { getLocalStore } from "@/lib/portal/repositories/store";

export class ProjectRepository {
  static async getAll(): Promise<Project[]> {
    if (isGoogleConfigured()) {
      try {
        const rows = await fetchSheetRows(SHEET_NAMES.PROJECTS);
        return rows as unknown as Project[];
      } catch (err) {
        console.error("Failed to fetch projects from Google Sheets:", err);
      }
    }
    return getLocalStore().projects;
  }

  static async getById(recordId: string): Promise<Project | null> {
    const all = await this.getAll();
    return all.find((p) => p.record_id === recordId) || null;
  }

  static async getByRollNumber(rollNumber: string): Promise<Project[]> {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.filter((p) => p.roll_number.trim().toUpperCase() === cleanRoll);
  }

  static async create(project: Omit<Project, "record_id" | "created_at" | "updated_at">): Promise<Project> {
    const all = await this.getAll();
    const nextNum = all.length + 1;
    const record_id = `PRJ-${String(nextNum).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    const newProject: Project = {
      ...project,
      record_id,
      roll_number: project.roll_number.trim().toUpperCase(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isGoogleConfigured()) {
      try {
        await appendSheetRow(SHEET_NAMES.PROJECTS, newProject);
      } catch (err) {
        console.error("Failed to append project to Google Sheets:", err);
      }
    }

    const store = getLocalStore();
    store.projects.unshift(newProject);
    return newProject;
  }

  static async delete(recordId: string): Promise<boolean> {
    const store = getLocalStore();
    const idx = store.projects.findIndex((p) => p.record_id === recordId);
    if (idx !== -1) {
      store.projects.splice(idx, 1);
      return true;
    }
    return false;
  }
}
