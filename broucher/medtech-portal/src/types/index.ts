// Core Domain Types for MedTech Student Data Portal

export type DegreeType = 
  | 'M.Tech – Medical Technology'
  | 'Ph.D. – Medical Technologies'
  | 'Ph.D. – Interdisciplinary'
  | 'M.Tech-Ph.D. Dual Degree'
  | 'Other';

export interface Student {
  student_id: string; // matches roll_number
  roll_number: string; // Primary Unique Identifier
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  degree: DegreeType | string;
  department: string;
  batch: string;
  specialization: string;
  graduation_year: string;
  supervisor: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'Active' | 'Alumni' | 'On Leave';
  created_at?: string;
  updated_at?: string;
}

export type PublicationType = 
  | 'Journal Article'
  | 'Conference Paper'
  | 'Book Chapter'
  | 'Review Article'
  | 'Other';

export type PublicationStatus = 
  | 'Published'
  | 'Accepted'
  | 'Under Review'
  | 'Submitted';

export interface Publication {
  record_id: string; // PUB-xxx
  roll_number: string;
  title: string;
  authors: string;
  journal_conference: string;
  publication_type: PublicationType;
  doi: string;
  publisher: string;
  publication_date: string;
  volume: string;
  issue: string;
  pages: string;
  url: string;
  student_contribution: string; // e.g. "First Author", "Co-Author"
  status: PublicationStatus;
  document_url?: string;
  drive_file_id?: string;
  created_at: string;
  updated_at: string;
}

export type PatentType = 
  | 'Indian Patent'
  | 'PCT'
  | 'Design Patent'
  | 'US Patent'
  | 'Other';

export type PatentStatus = 
  | 'Draft'
  | 'Filed'
  | 'Published'
  | 'Under Examination'
  | 'Granted'
  | 'Rejected'
  | 'Other';

export interface Patent {
  record_id: string; // PAT-xxx
  roll_number: string;
  title: string;
  inventors: string;
  application_no: string;
  patent_no: string;
  filing_date: string;
  publication_date: string;
  patent_type: PatentType;
  patent_office: string;
  status: PatentStatus;
  applicant_organization: string;
  patent_url: string;
  document_url?: string;
  drive_file_id?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectType = 
  | 'Academic'
  | 'Research'
  | 'Industry'
  | 'Startup'
  | 'Personal'
  | 'Other';

export type ProjectStatus = 'Ongoing' | 'Completed' | 'Proposed';

export interface Project {
  record_id: string; // PRJ-xxx
  roll_number: string;
  title: string;
  project_type: ProjectType;
  description: string;
  supervisor: string;
  organization: string;
  start_date: string;
  end_date: string;
  technologies: string;
  status: ProjectStatus;
  project_url: string;
  document_url?: string;
  drive_file_id?: string;
  created_at: string;
  updated_at: string;
}

export type InternshipType = 
  | 'Industrial'
  | 'Clinical / Hospital'
  | 'Academic Research'
  | 'R&D'
  | 'Other';

export type InternshipStatus = 'Completed' | 'Ongoing' | 'Upcoming';

export interface Internship {
  record_id: string; // INT-xxx
  roll_number: string;
  organization: string;
  role: string;
  internship_type: InternshipType;
  start_date: string;
  end_date: string;
  description: string;
  technologies: string;
  supervisor: string;
  location: string;
  status: InternshipStatus;
  certificate_url?: string;
  offer_letter_url?: string;
  created_at: string;
  updated_at: string;
}

export type AchievementCategory = 
  | 'Award'
  | 'Competition'
  | 'Scholarship'
  | 'Academic'
  | 'Sports'
  | 'Leadership'
  | 'Technical'
  | 'Other';

export interface Achievement {
  record_id: string; // ACH-xxx
  roll_number: string;
  title: string;
  category: AchievementCategory;
  organization: string;
  date: string;
  description: string;
  position_rank: string;
  url: string;
  proof_url?: string;
  created_at: string;
  updated_at: string;
}

export type ConferenceType = 'National' | 'International';
export type ParticipationType = 
  | 'Oral Presentation'
  | 'Poster Presentation'
  | 'Attendee'
  | 'Session Chair'
  | 'Keynote';

export interface Conference {
  record_id: string; // CNF-xxx
  roll_number: string;
  conference_name: string;
  conference_type: ConferenceType;
  location: string;
  date: string;
  participation_type: ParticipationType;
  paper_presented: string; // 'Yes' | 'No'
  presentation_title: string;
  organizer: string;
  url: string;
  certificate_url?: string;
  created_at: string;
  updated_at: string;
}

export type StartupStatus = 'Incubated' | 'Pre-Incubatee' | 'Graduated' | 'Active' | 'Ideation';

export interface Startup {
  record_id: string; // STU-xxx
  roll_number: string;
  startup_name: string;
  founder_role: string;
  cofounders: string;
  domain: string;
  description: string;
  founded_year: string;
  website: string;
  current_status: StartupStatus;
  incubator: string;
  funding: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
}

export type DocumentCategory = 
  | 'Publications'
  | 'Patents'
  | 'Projects'
  | 'Internships'
  | 'Achievements'
  | 'Conferences'
  | 'Startups'
  | 'Other';

export interface DocumentRecord {
  document_id: string; // DOC-xxx
  roll_number: string;
  record_id: string;
  category: DocumentCategory;
  original_filename: string;
  generated_filename: string;
  file_type: string;
  file_size: number;
  drive_file_id: string;
  drive_url: string;
  uploaded_at: string;
}

export type AuditAction = 
  | 'STUDENT_CREATED'
  | 'PROFILE_UPDATED'
  | 'PUBLICATION_ADDED'
  | 'PATENT_ADDED'
  | 'PROJECT_ADDED'
  | 'INTERNSHIP_ADDED'
  | 'ACHIEVEMENT_ADDED'
  | 'CONFERENCE_ADDED'
  | 'STARTUP_ADDED'
  | 'DOCUMENT_UPLOADED'
  | 'RECORD_UPDATED'
  | 'RECORD_DELETED';

export interface AuditLog {
  log_id: string;
  timestamp: string;
  user: string;
  roll_number: string;
  action: AuditAction;
  module: string;
  record_id: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  description: string;
}

export interface StudentDashboardSummary {
  student: Student;
  counts: {
    publications: number;
    patents: number;
    projects: number;
    internships: number;
    achievements: number;
    conferences: number;
    startups: number;
    documents: number;
  };
}

export interface AdminStats {
  totalStudents: number;
  totalPublications: number;
  totalPatents: number;
  totalProjects: number;
  totalInternships: number;
  totalAchievements: number;
  totalConferences: number;
  totalStartups: number;
  totalDocuments: number;
  recentLogs: AuditLog[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  warning?: string;
}
