/**
 * Content models for the Medical Technologies Center.
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

export interface Startup extends BaseRecord {
  name: string;
  description: string;
  founders?: string[];
  url?: string;
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
}

export interface SiteConfig {
  name: string;
  shortName: string;
  partners: string;
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
