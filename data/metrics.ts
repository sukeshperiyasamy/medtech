import type { Metric } from "@/lib/types";
import { faculty } from "@/data/people";

// Only counts that can be verified against official pages carry a value.
// `value: null` is never shown as a number: it appears under "Research output" as a link
// to where that work can be explored, until a verified count is published.
export const metrics: Metric[] = [
  { id: "students", label: "Students admitted", value: 99, note: "Master's, PhD & Dual Degree, 2020–2026", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/master-medical-technologies" },
  { id: "programs", label: "Degree programmes offered", value: 2, note: "Master's and PhD", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies" },
  { id: "faculty", label: "Affiliated IIT Jodhpur faculty", value: faculty.length, note: "Approved affiliated faculty" },
  { id: "cohorts", label: "Master's cohorts", value: 7, note: "2020–2026", sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/master-medical-technologies" },
  { id: "projects", label: "Research projects", value: null, note: "Verification pending", link: { label: "Explore research", url: "/research" } },
  { id: "publications", label: "Publications", value: null, note: "Verification pending", link: { label: "Explore research", url: "/research" } },
  { id: "patents", label: "Patents & technologies", value: null, note: "Verification pending", link: { label: "View innovation", url: "/research#innovation" } },
  { id: "startups", label: "Ventures", value: null, note: "Verification pending", link: { label: "Explore ventures", url: "/startups" } },
];
