import type { NewsItem } from "@/lib/types";

// Sources: official Medical Technologies home page announcements, the admissions page
// and the ICMI 2025 conference site (retrieved 25 Sep 2026).
const HOME = "https://www.iitj.ac.in/medical-technologies/en/medical-technologies";
const ADMISSION =
  "https://www.iitj.ac.in/admission-postgraduate-programs/en/masters-and-phd-programs-in-medical-technologies";

export const news: NewsItem[] = [
  {
    id: "icmi-2025",
    slug: "icmi-2025",
    status: "published",
    provenance: "verified",
    sourceUrl: "https://events.iitj.ac.in/icmi/",
    title: "Indian Conference on MedTech Innovations (ICMI) 2025",
    category: "Conference",
    date: "2025-02-15",
    endDate: "2025-02-17",
    venue: "Jodhpur Club, IIT Jodhpur & Auditorium, AIIMS Jodhpur",
    summary:
      "Hosted jointly by IIT Jodhpur and AIIMS Jodhpur, ICMI brought together experts, executives and innovators — with clinical immersion, a hackathon, deep-tech exposure and start-up partners for students.",
    link: { label: "Conference website", url: "https://events.iitj.ac.in/icmi/" },
    image: {
      src: "/images/icmi-2025/icmi-2025-04-auditorium.jpg",
      alt: "The ICMI 2025 main auditorium, with the conference title on screen and the panel seated on stage",
      width: 2000,
      height: 1500,
    },
    featured: true,
  },
  {
    id: "written-test-2026",
    slug: "written-test-interview-2026",
    status: "published",
    provenance: "verified",
    sourceUrl: HOME,
    title: "Written test and interview held at AIIMS Jodhpur",
    category: "Admissions",
    date: "2026-05-28",
    endDate: "2026-05-29",
    venue: "AIIMS Jodhpur (offline)",
    summary:
      "The written test (multiple-choice) and interviews for Master's and PhD admissions were conducted in offline mode.",
    link: { label: "View announcement", url: HOME },
  },
  {
    id: "admissions-open-2026",
    slug: "admissions-2026-27",
    status: "published",
    provenance: "verified",
    sourceUrl: ADMISSION,
    title: "Master's and PhD programmes in Medical Technologies for A.Y. 2026–27",
    category: "Admissions",
    date: "2026-04-30",
    summary: "Applications for the 2026–27 intake closed on 30 April 2026.",
    link: { label: "Admission details", url: ADMISSION },
  },
];
