/**
 * Data access layer.
 *
 * Every page/section fetches content through these async functions. Today they read
 * local modules in /data; later they can call a CMS or a PostgreSQL-backed API with
 * the same signatures, and no UI component needs to change.
 */
import { site } from "@/data/site";
import { people } from "@/data/people";
import { researchAreas } from "@/data/research";
import { programs } from "@/data/programs";
import { projects, projectStages } from "@/data/projects";
import { grants } from "@/data/grants";
import { news } from "@/data/news";
import { pipeline } from "@/data/pipeline";
import { metrics } from "@/data/metrics";
import { pathways } from "@/data/collaboration";
import { startups, trlScale } from "@/data/startups";
import { students } from "@/data/students";
import type { Person, PersonCategory } from "@/lib/types";

/**
 * Sample (demo) records are only served in development, or when a review build sets
 * SHOW_SAMPLE_CONTENT=true. Production shows verified records only.
 */
export const SHOW_SAMPLES =
  process.env.NODE_ENV !== "production" || process.env.SHOW_SAMPLE_CONTENT === "true";
const visible = <T extends { provenance: string }>(rows: T[]) =>
  SHOW_SAMPLES ? rows : rows.filter((r) => r.provenance === "verified");

export const getSite = async () => site;

export const getResearchAreas = async () => researchAreas;
export const getResearchArea = async (slug: string) =>
  researchAreas.find((a) => a.slug === slug) ?? null;

/** Programmes currently offered. Use getAllPrograms() where history matters (e.g. cohorts). */
export const getPrograms = async () => programs.filter((p) => p.availability === "offered");
export const getAllPrograms = async () => programs;
export const getProjects = async () => visible(projects);
export const getProjectStages = async () => projectStages;
export const getGrants = async () => visible(grants);
export const getPipeline = async () => pipeline;
export const getMetrics = async () => metrics;
export const getCollaborationPathways = async () => pathways;
export const getStartups = async () => visible(startups);
export const getStartup = async (slug: string) =>
  visible(startups).find((s) => s.slug === slug) ?? null;
export const getTrlScale = async () => trlScale;
export const getStudents = async (programId?: string) =>
  programId ? students.filter((s) => s.programId === programId) : students;

export const getNews = async () => [...news].sort((a, b) => b.date.localeCompare(a.date));

export const getPeople = async (category?: PersonCategory) =>
  category ? people.filter((p) => p.category === category) : people;

export const getPeopleByIds = async (ids: string[]) =>
  ids.map((id) => people.find((p) => p.id === id)).filter((p): p is Person => Boolean(p));
