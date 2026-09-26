/**
 * Content models for the Medical Technology Centre.
 *
 * These shapes are intentionally flat and ID-keyed so they map one-to-one onto
 * future PostgreSQL tables / CMS collections. UI components only ever depend on
 * these types — never on where the data comes from.
 */

/** Editorial workflow state, ready for a future /admin (draft → review → publish). */
export type PublishStatus = "draft" | "review" | "published";

/**
 * How trustworthy a record is. `verified` = taken from an official IIT Jodhpur /
 * AIIMS Jodhpur source. `sample` = placeholder shown only to demonstrate the UI;
 * it must be replaced before launch and is visibly labelled on the page.
 */
export type Provenance = "verified" | "sample";

export interface BaseRecord {
  id: string;
  slug: string;
  status: PublishStatus;
  provenance: Provenance;
  /** Where the fact was sourced from, for editorial audit. */
  sourceUrl?: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface Media {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
}

export type Institution = "IIT Jodhpur" | "AIIMS Jodhpur";

export interface ResearchArea extends BaseRecord {
  title: string;
  shortTitle: string;
  summary: string;
  keywords: string[];
  /** Person IDs whose official research interests fall in this theme. */
  facultyIds: string[];
  image?: Media;
}

export type ProjectStage = "Research" | "Prototype" | "Validation" | "Clinical" | "Translation";

export interface Project extends BaseRecord {
  title: string;
  clinicalProblem: string;
  technology: string;
  researchAreaId: string;
  stage: ProjectStage;
  researcherIds: string[];
  image?: Media;
  publications?: Link[];
  patent?: string;
  links?: Link[];
}

export type PersonCategory =
  | "Leadership"
  | "Faculty"
  | "Visiting Faculty"
  | "Researchers"
  | "Students"
  | "Staff";

export interface Person extends BaseRecord {
  name: string;
  designation: string;
  category: PersonCategory;
  institution: Institution;
  department?: string;
  photo?: Media;
  education?: string;
  researchInterests: string[];
  bio?: string;
  /** Only where officially published. Stored de-obfuscated. */
  email?: string;
  phone?: string;
  profileUrl?: string;
}

export interface Program extends BaseRecord {
  title: string;
  shortTitle: string;
  degree: string;
  /** Discontinued programmes stay in the data for their cohorts and history. */
  availability: "offered" | "discontinued";
  /** e.g. "2020–2025" for a discontinued programme's admission years. */
  intakeYears?: string;
  overview: string;
  eligibility?: string;
  duration?: string;
  curriculum?: string;
  clinicalExposure?: string;
  admission?: Link[];
  brochure?: Link;
  cohortsUrl?: string;
}

export type GrantCategory =
  | "Government"
  | "Medical Technology"
  | "Biotechnology"
  | "Deep Tech"
  | "Startup"
  | "Industry Sponsored"
  | "International";

export type GrantStatus = "Open" | "Upcoming" | "Rolling" | "Closed" | "Unverified";

export interface Grant extends BaseRecord {
  name: string;
  agency: string;
  categories: GrantCategory[];
  researchArea: string;
  eligibility: string;
  amount?: string;
  deadline?: string;
  grantStatus: GrantStatus;
  officialUrl: string;
}

export interface Publication extends BaseRecord {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  researchAreaId?: string;
  doi?: string;
  url?: string;
}

export interface Patent extends BaseRecord {
  title: string;
  inventors: string[];
  technologyArea: string;
  patentStatus: "Filed" | "Published" | "Granted";
  applicationNumber?: string;
  projectId?: string;
  url?: string;
}

export interface Lab extends BaseRecord {
  name: string;
  institution: Institution;
  description: string;
  equipment?: string[];
  image?: Media;
}

export type NewsCategory =
  | "Admissions"
  | "Announcement"
  | "Conference"
  | "Workshop"
  | "Seminar"
  | "Award"
  | "Achievement";

export interface NewsItem extends BaseRecord {
  title: string;
  category: NewsCategory;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Optional end date for multi-day events. */
  endDate?: string;
  summary: string;
  venue?: string;
  image?: Media;
  link?: Link;
  featured?: boolean;
}

export interface Student {
  /** Roll number doubles as the stable ID. */
  id: string;
  rollNumber: string;
  name: string;
  programId: string;
  /** Year of admission, as listed on the official cohort pages. */
  cohortYear: number;
  /** Unknown until confirmed by the Centre — never inferred from the cohort year. */
  status?: "current" | "alumni";
  photo?: Media;
  profileUrl?: string;
  /** For alumni: current role / organisation, once provided by the alumnus. */
  currentRole?: string;
  startupId?: string;
  provenance: Provenance;
  sourceUrl: string;
}

/** Technology Readiness Level, 1 (basic principles) → 9 (proven in operational use). */
export type TRL = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Founder {
  name: string;
  role: string;
  /** e.g. "Master's in Medical Technologies, 2022 cohort" or "AIIMS Jodhpur". */
  affiliation?: string;
  photo?: Media;
  profileUrl?: string;
}

export interface FundingAward {
  /** Grant, fellowship, incubator or investor. */
  source: string;
  programme?: string;
  kind: "Grant" | "Fellowship" | "Incubation" | "Seed investment" | "Prize" | "Other";
  amount?: string;
  year?: number;
}

export interface StartupProduct {
  name: string;
  description: string;
  image?: Media;
}

export type AchievementCategory =
  | "Medal"
  | "Award"
  | "Fellowship"
  | "Selection"
  | "Grant"
  | "Investment"
  | "Patent"
  | "Competition"
  | "Recognition";

export interface AchievementRecipient {
  /** Name as shown on the official source. */
  name: string;
  /** Roll number in data/students.ts, when the recipient is a student. */
  studentId?: string;
  /** Person id in data/people.ts, when the recipient is faculty/staff. */
  personId?: string;
}

/** A medal, fellowship, award or recognition earned by the Centre's people. */
export interface Achievement extends BaseRecord {
  title: string;
  /** Short label for badges, e.g. "Silver Medal". Defaults to `title`. */
  shortTitle?: string;
  /** Startup / venture the achievement belongs to, if any. */
  venture?: string;
  category: AchievementCategory;
  /** Who awarded it, e.g. "IIT Jodhpur · 10th Convocation". Omit when the source does not say. */
  awardedBy?: string;
  /** ISO date when known; otherwise only `year`. */
  date?: string;
  year: number;
  level?: "Institute" | "National" | "International";
  audience: "Student" | "Faculty" | "Centre";
  recipients: AchievementRecipient[];
  summary?: string;
  /** Extra facts from the source, e.g. host institution, project title, mentors. */
  details?: { label: string; value: string }[];
  image?: Media & { width: number; height: number };
  link?: Link;
  /** Where the fact comes from when there is no public URL (e.g. an internal announcement). */
  sourceNote?: string;
}

/** A vertical (sub-unit) of the Medical Technology Centre. */
export interface Vertical {
  id: string;
  name: string;
  /** Short tagline, official where one exists. */
  tagline: string;
  summary: string;
  /** Institutions running it — shown as logos. */
  institutions: Institution[];
  highlights: string[];
  href: string;
  officialUrl?: string;
  sourceUrl: string;
}

export interface Partner {
  name: string;
  description: string;
  url?: string;
}

/** Official content of the Centre for Digital Health (iitj.ac.in/cdh). */
export interface DigitalHealthContent {
  tagline: string;
  intro: string[];
  vision: string;
  mission: string[];
  alignedWith: string[];
  capacityBuilding: { intro: string; upcomingPrograms: string[]; audiences: string[] };
  researchAreas: string[];
  openSource: { goal: string; activities: string[] };
  partners: Partner[];
  knowledgePartner: Partner;
  coordinator: { name: string; role: string; email: string; phone: string };
  officialUrl: string;
  sources: string[];
}

/** A photograph in an event/media gallery. */
/**
 * One photograph. Flat and ID-keyed so a future admin can add / edit / delete images.
 * Only verified metadata is filled in — `event` and `caption` stay empty when unknown.
 */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** ISO date (from the export timestamp or camera EXIF). */
  date?: string;
  category?: string;
  /** Event name, only when confirmed (e.g. by visible signage), or a NewsItem id. */
  event?: string;
  caption?: string;
  /** Dominant colour — shown while the image loads. */
  color?: string;
  /** Picked for the homepage "From the Gallery" section. */
  featured?: boolean;
}

export interface Startup extends BaseRecord {
  name: string;
  tagline: string;
  description: string;
  clinicalProblem?: string;
  researchAreaId?: string;
  foundedYear?: number;
  logo?: Media;
  teamPhoto?: Media;
  product: StartupProduct;
  trl: TRL;
  /** What the current TRL is evidenced by (e.g. "Validated at AIIMS Jodhpur"). */
  trlEvidence?: string;
  founders: Founder[];
  /** Person IDs of faculty mentors (data/people.ts). */
  mentorIds: string[];
  funding: FundingAward[];
  incubator?: string;
  website?: string;
  links?: Link[];
}

export interface CollaborationPathway {
  id: string;
  audience: string;
  title: string;
  description: string;
  cta: Link;
}

export interface Metric {
  id: string;
  label: string;
  /** `null` = not yet verified; rendered as pending rather than a made-up number. */
  value: number | null;
  suffix?: string;
  note: string;
  sourceUrl?: string;
  /** Where to explore this output while no verified count is published. */
  link?: Link;
}

export interface PipelineStage {
  id: string;
  index: number;
  title: string;
  question: string;
  description: string;
  who: string;
  accent: "blue" | "cyan" | "teal";
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface SiteConfig {
  name: string;
  shortName: string;
  /** Parent institution — the Centre belongs to IIT Jodhpur. */
  parent: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: string[];
  mapUrl: string;
  officialUrl: string;
  institutions: { name: Institution; url: string; logo: Media }[];
  social: Link[];
  nav: NavItem[];
  announcement?: Link & { tag: string };
}
