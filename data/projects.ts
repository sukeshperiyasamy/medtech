import type { Project } from "@/lib/types";

// ⚠ SAMPLE DATA. The official website does not yet list Centre projects. These three
// slots show how verified projects will be presented; they name no researchers and
// claim no results. Each is labelled "Sample" on the page. Replace before launch.
export const projects: Project[] = [
  {
    id: "sample-poc",
    slug: "sample-point-of-care",
    status: "draft",
    provenance: "sample",
    title: "Point-of-care sensing platform",
    clinicalProblem: "Clinical problem statement, as framed with AIIMS Jodhpur clinicians.",
    technology: "Technology summary — sensing principle, device form factor, data pathway.",
    researchAreaId: "sensors-diagnostics",
    stage: "Prototype",
    researcherIds: [],
  },
  {
    id: "sample-imaging",
    slug: "sample-imaging-ai",
    status: "draft",
    provenance: "sample",
    title: "AI-assisted image analysis tool",
    clinicalProblem: "Clinical problem statement, as framed with AIIMS Jodhpur clinicians.",
    technology: "Technology summary — model, dataset governance, validation protocol.",
    researchAreaId: "imaging-ai",
    stage: "Validation",
    researcherIds: [],
  },
  {
    id: "sample-rehab",
    slug: "sample-rehabilitation",
    status: "draft",
    provenance: "sample",
    title: "Assistive rehabilitation device",
    clinicalProblem: "Clinical problem statement, as framed with AIIMS Jodhpur clinicians.",
    technology: "Technology summary — mechanism, control, user trials.",
    researchAreaId: "rehab-robotics",
    stage: "Research",
    researcherIds: [],
  },
];

export const projectStages: Project["stage"][] = [
  "Research",
  "Prototype",
  "Validation",
  "Clinical",
  "Translation",
];
