import type { Vertical } from "@/lib/types";

// The Medical Technology Centre (IIT Jodhpur) has two verticals, per the Head of the
// Centre (Sep 2026). Taglines and summaries follow each unit's official page.
export const verticals: Vertical[] = [
  {
    id: "medical-technologies",
    name: "Medical Technologies Program",
    tagline: "A multi-disciplinary program to produce deep-tech innovators in the field of Medical Technologies",
    summary:
      "Post-graduate programmes offered jointly by IIT Jodhpur and AIIMS Jodhpur, knitting together medical science and engineering with emphasis on translational R&D, innovation, technology management and entrepreneurship.",
    institutions: ["IIT Jodhpur", "AIIMS Jodhpur"],
    highlights: [
      "Master's and PhD in Medical Technologies",
      "Equal seats for medical and engineering graduates",
      "Indian Conference on MedTech Innovations (ICMI)",
    ],
    href: "/medical-technologies",
    officialUrl: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies",
    sourceUrl: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies",
  },
  {
    id: "digital-health",
    name: "Centre for Digital Health",
    tagline: "Health Equity through Digital Transformation",
    summary:
      "Health for all through the digital transformation of healthcare — cutting-edge research, academic programmes, an open data ecosystem and disruptive innovation, so affordable care reaches people at scale.",
    institutions: ["IIT Jodhpur"],
    highlights: [
      "Upcoming Certificate, Diploma, MBA, M.Tech and MS (R) programmes",
      "Research from dependable AI to disease surveillance",
      "Open-source digital public goods for health",
    ],
    href: "/digital-health",
    officialUrl: "https://www.iitj.ac.in/cdh",
    sourceUrl: "https://www.iitj.ac.in/cdh",
  },
];
