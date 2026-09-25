import type { Startup, TRL } from "@/lib/types";

// ⚠ SAMPLE DATA. The official website does not yet list the Center's student-led
// startups. These three slots demonstrate the showcase (profile, product, TRL, team,
// funding) and are labelled "Sample" on the page. Replace with verified entries —
// confirm every grant/investment with the founders before publishing.
const founders = [
  { name: "Founder name", role: "Co-founder & CEO", affiliation: "Master's in Medical Technologies · cohort year" },
  { name: "Founder name", role: "Co-founder & CTO", affiliation: "PhD in Medical Technologies" },
  { name: "Clinical co-founder", role: "Clinical lead", affiliation: "AIIMS Jodhpur" },
];

const funding = [
  { source: "Funding body", programme: "Grant / scheme name", kind: "Grant" as const, amount: "Amount", year: undefined },
  { source: "Incubator", programme: "Incubation programme", kind: "Incubation" as const },
];

export const startups: Startup[] = [
  {
    id: "venture-01",
    slug: "venture-01",
    status: "draft",
    provenance: "sample",
    name: "Venture 01",
    tagline: "Point-of-care diagnostic device",
    description:
      "One-paragraph company profile: what the startup builds, for whom, and why it matters clinically.",
    clinicalProblem: "Clinical problem the product addresses, as identified at AIIMS Jodhpur.",
    researchAreaId: "sensors-diagnostics",
    product: { name: "Product name", description: "What the product does and how it is used in care." },
    trl: 5,
    trlEvidence: "Evidence for the current TRL (e.g. prototype validated in a relevant environment).",
    founders,
    mentorIds: [],
    funding,
  },
  {
    id: "venture-02",
    slug: "venture-02",
    status: "draft",
    provenance: "sample",
    name: "Venture 02",
    tagline: "AI-assisted clinical imaging",
    description:
      "One-paragraph company profile: what the startup builds, for whom, and why it matters clinically.",
    clinicalProblem: "Clinical problem the product addresses, as identified at AIIMS Jodhpur.",
    researchAreaId: "imaging-ai",
    product: { name: "Product name", description: "What the product does and how it is used in care." },
    trl: 7,
    trlEvidence: "Evidence for the current TRL (e.g. pilot deployment in a clinical setting).",
    founders: founders.slice(0, 2),
    mentorIds: [],
    funding,
  },
  {
    id: "venture-03",
    slug: "venture-03",
    status: "draft",
    provenance: "sample",
    name: "Venture 03",
    tagline: "Assistive rehabilitation technology",
    description:
      "One-paragraph company profile: what the startup builds, for whom, and why it matters clinically.",
    clinicalProblem: "Clinical problem the product addresses, as identified at AIIMS Jodhpur.",
    researchAreaId: "rehab-robotics",
    product: { name: "Product name", description: "What the product does and how it is used in care." },
    trl: 3,
    trlEvidence: "Evidence for the current TRL (e.g. proof of concept demonstrated in the lab).",
    founders,
    mentorIds: [],
    funding: funding.slice(0, 1),
  },
];

/** Standard TRL scale, grouped into three phases for display. */
export const trlScale: { level: TRL; label: string; phase: "Research" | "Development" | "Deployment" }[] = [
  { level: 1, label: "Basic principles observed", phase: "Research" },
  { level: 2, label: "Technology concept formulated", phase: "Research" },
  { level: 3, label: "Proof of concept", phase: "Research" },
  { level: 4, label: "Validated in the lab", phase: "Development" },
  { level: 5, label: "Validated in a relevant environment", phase: "Development" },
  { level: 6, label: "Demonstrated in a relevant environment", phase: "Development" },
  { level: 7, label: "Demonstrated in an operational setting", phase: "Deployment" },
  { level: 8, label: "System complete and qualified", phase: "Deployment" },
  { level: 9, label: "Proven in operational use", phase: "Deployment" },
];
