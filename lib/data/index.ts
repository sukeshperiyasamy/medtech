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
import type { Person, PersonCategory } from "@/lib/types";

export const getSite = async () => site;

export const getResearchAreas = async () => researchAreas;
export const getResearchArea = async (slug: string) =>
  researchAreas.find((a) => a.slug === slug) ?? null;

export const getPrograms = async () => programs;
export const getProjects = async () => projects;
export const getProjectStages = async () => projectStages;
export const getGrants = async () => grants;
export const getPipeline = async () => pipeline;
export const getMetrics = async () => metrics;
export const getCollaborationPathways = async () => pathways;

export const getNews = async () => [...news].sort((a, b) => b.date.localeCompare(a.date));

export const getPeople = async (category?: PersonCategory) =>
  category ? people.filter((p) => p.category === category) : people;

export const getPeopleByIds = async (ids: string[]) =>
  ids.map((id) => people.find((p) => p.id === id)).filter((p): p is Person => Boolean(p));
