import initialSeedData from "@/lib/data/seed.json";
import {
  Student,
  Publication,
  Patent,
  Project,
  Internship,
  Achievement,
  Conference,
  Startup,
  DocumentRecord,
  AuditLog,
} from "@/types";

interface MemoryStore {
  students: Student[];
  publications: Publication[];
  patents: Patent[];
  projects: Project[];
  internships: Internship[];
  achievements: Achievement[];
  conferences: Conference[];
  startups: Startup[];
  documents: DocumentRecord[];
  audit_logs: AuditLog[];
}

// Global singleton in memory so changes persist across requests during runtime
const globalForStore = globalThis as unknown as {
  medtechStore?: MemoryStore;
};

export function getLocalStore(): MemoryStore {
  if (!globalForStore.medtechStore) {
    globalForStore.medtechStore = {
      students: [...((initialSeedData.students as Student[]) || [])],
      publications: [...((initialSeedData.publications as Publication[]) || [])],
      patents: [...((initialSeedData.patents as Patent[]) || [])],
      projects: [...((initialSeedData.projects as Project[]) || [])],
      internships: [...((initialSeedData.internships as Internship[]) || [])],
      achievements: [...((initialSeedData.achievements as Achievement[]) || [])],
      conferences: [...((initialSeedData.conferences as Conference[]) || [])],
      startups: [...((initialSeedData.startups as Startup[]) || [])],
      documents: [...((initialSeedData.documents as DocumentRecord[]) || [])],
      audit_logs: [...((initialSeedData.audit_logs as AuditLog[]) || [])],
    };
  }
  return globalForStore.medtechStore;
}
