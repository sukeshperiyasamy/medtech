import type { Grant } from "@/lib/types";

// ⚠ SAMPLE DATA. These rows reference long-running national schemes only so the
// funding explorer can be reviewed with realistic shapes. No deadline, amount or
// status below is a current call. Every row carries `provenance: "sample"` and is
// labelled on the page. Replace with verified, dated calls before launch.
const sample = (g: Omit<Grant, "status" | "provenance" | "slug" | "grantStatus">): Grant => ({
  ...g,
  slug: g.id,
  status: "draft",
  provenance: "sample",
  grantStatus: "Unverified",
});

export const grants: Grant[] = [
  sample({
    id: "birac-big",
    name: "Biotechnology Ignition Grant (BIG)",
    agency: "BIRAC",
    categories: ["Biotechnology", "Startup", "Medical Technology"],
    researchArea: "Early-stage biotech & medtech ideas",
    eligibility: "Researchers, start-ups and entrepreneurs — see official call",
    officialUrl: "https://birac.nic.in",
  }),
  sample({
    id: "icmr-extramural",
    name: "Extramural Research Programme",
    agency: "ICMR",
    categories: ["Government", "Medical Technology"],
    researchArea: "Biomedical & health research",
    eligibility: "Scientists at recognised institutions — see official call",
    officialUrl: "https://www.icmr.gov.in",
  }),
  sample({
    id: "anrf-core",
    name: "Core Research Grant",
    agency: "ANRF",
    categories: ["Government", "Deep Tech"],
    researchArea: "Science & engineering research",
    eligibility: "Faculty at academic institutions — see official call",
    officialUrl: "https://www.anrfonline.in",
  }),
  sample({
    id: "dbt-programmes",
    name: "Medical Biotechnology programmes",
    agency: "DBT",
    categories: ["Government", "Biotechnology"],
    researchArea: "Medical biotechnology & devices",
    eligibility: "See official call",
    officialUrl: "https://dbtindia.gov.in",
  }),
  sample({
    id: "industry-sponsored",
    name: "Industry-sponsored research",
    agency: "Industry partners",
    categories: ["Industry Sponsored"],
    researchArea: "Problem-specific device development",
    eligibility: "Via IIT Jodhpur sponsored research process",
    officialUrl: "https://www.iitj.ac.in",
  }),
  sample({
    id: "international",
    name: "International collaborative calls",
    agency: "Bilateral programmes",
    categories: ["International"],
    researchArea: "Joint medtech research",
    eligibility: "See official call",
    officialUrl: "https://www.iitj.ac.in",
  }),
];
