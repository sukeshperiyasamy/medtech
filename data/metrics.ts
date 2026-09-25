import type { Metric } from "@/lib/types";

// Only counts that can be verified against official pages carry a value.
// `value: null` renders as "Awaiting verified data" — never as an invented number.
export const metrics: Metric[] = [
  { id: "students", label: "Students admitted", value: 99, note: "Master's, PhD & Dual Degree, 2020–2026", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/master-medical-technologies" },
  { id: "programs", label: "Degree programmes offered", value: 2, note: "Master's and PhD", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies" },
  { id: "faculty", label: "Affiliated IIT Jodhpur faculty", value: 29, note: "Listed on the official People page", sourceUrl: "https://www.iitj.ac.in/People?dept=Medical-Technologies" },
  { id: "cohorts", label: "Master's cohorts admitted", value: 7, note: "Every year, 2020 to 2026", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/master-medical-technologies" },
  { id: "projects", label: "Research projects", value: null, note: "Awaiting verified data" },
  { id: "publications", label: "Publications", value: null, note: "Awaiting verified data" },
  { id: "patents", label: "Patents & technologies", value: null, note: "Awaiting verified data" },
  { id: "startups", label: "Start-ups", value: null, note: "Awaiting verified data" },
];
