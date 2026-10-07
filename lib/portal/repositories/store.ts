import initialSeedData from "@/lib/portal/data/seed.json";
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
  StudentSubmission,
} from "@/lib/portal/types";

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
  submissions: StudentSubmission[];
}

const globalForStore = globalThis as unknown as {
  medtechStore?: MemoryStore;
};

export function getLocalStore(): MemoryStore {
  if (!globalForStore.medtechStore) {
    globalForStore.medtechStore = {
      students: [...((initialSeedData.students as unknown as Student[]) || [])],
      publications: [...((initialSeedData.publications as unknown as Publication[]) || [])],
      patents: [...((initialSeedData.patents as unknown as Patent[]) || [])],
      projects: [...((initialSeedData.projects as unknown as Project[]) || [])],
      internships: [...((initialSeedData.internships as unknown as Internship[]) || [])],
      achievements: [...((initialSeedData.achievements as unknown as Achievement[]) || [])],
      conferences: [...((initialSeedData.conferences as unknown as Conference[]) || [])],
      startups: [...((initialSeedData.startups as unknown as Startup[]) || [])],
      documents: [...((initialSeedData.documents as unknown as DocumentRecord[]) || [])],
      audit_logs: [...((initialSeedData.audit_logs as unknown as AuditLog[]) || [])],
      submissions: [],
    };
  }
  if (!globalForStore.medtechStore.submissions) {
    globalForStore.medtechStore.submissions = [];
  }
  return globalForStore.medtechStore;
}

export function reloadLocalStore(): MemoryStore {
  globalForStore.medtechStore = {
    students: [...((initialSeedData.students as unknown as Student[]) || [])],
    publications: [...((initialSeedData.publications as unknown as Publication[]) || [])],
    patents: [...((initialSeedData.patents as unknown as Patent[]) || [])],
    projects: [...((initialSeedData.projects as unknown as Project[]) || [])],
    internships: [...((initialSeedData.internships as unknown as Internship[]) || [])],
    achievements: [...((initialSeedData.achievements as unknown as Achievement[]) || [])],
    conferences: [...((initialSeedData.conferences as unknown as Conference[]) || [])],
    startups: [...((initialSeedData.startups as unknown as Startup[]) || [])],
    documents: [...((initialSeedData.documents as unknown as DocumentRecord[]) || [])],
    audit_logs: [...((initialSeedData.audit_logs as unknown as AuditLog[]) || [])],
    submissions: [],
  };
  return globalForStore.medtechStore;
}
