import type { Program } from "@/lib/types";

// Sources:
//  https://www.iitj.ac.in/medical-technologies/en/medical-technologies
//  https://www.iitj.ac.in/admission-postgraduate-programs/en/masters-and-phd-programs-in-medical-technologies
// Fields left undefined are not published officially yet and render as "To be confirmed".
const HOME = "https://www.iitj.ac.in/medical-technologies/en/medical-technologies";
const ADMISSION =
  "https://www.iitj.ac.in/admission-postgraduate-programs/en/masters-and-phd-programs-in-medical-technologies";

const SHARED_ELIGIBILITY =
  "Open to medical and engineering graduates, with an equal number of seats offered to each.";
const SHARED_CURRICULUM =
  "Coursework offered jointly by IIT Jodhpur and AIIMS Jodhpur, knitting together medical science and engineering technology with emphasis on translational R&D, innovation, technology management and entrepreneurship.";

export const programs: Program[] = [
  {
    id: "masters",
    slug: "masters-medical-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: HOME,
    title: "Master's in Medical Technologies",
    shortTitle: "Master's",
    degree: "Master's",
    availability: "offered",
    overview:
      "For highly motivated professionals with a distinct flair for interdisciplinary research and innovation. Coursework is followed by a project enabling the creation of a futuristic device, process, product or protocol.",
    eligibility: SHARED_ELIGIBILITY,
    curriculum: SHARED_CURRICULUM,
    clinicalExposure: "Jointly delivered with AIIMS Jodhpur.",
    admission: [
      { label: "Admissions A.Y. 2026–27", url: ADMISSION },
      { label: "Apply online (Master's)", url: "https://erponline.iitj.ac.in/Admission/index?admiss_ch=50" },
    ],
    cohortsUrl: "https://www.iitj.ac.in/medical-technologies/en/master-medical-technologies",
  },
  {
    id: "phd",
    slug: "phd-medical-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: HOME,
    title: "PhD in Medical Technologies",
    shortTitle: "PhD",
    degree: "Doctoral",
    availability: "offered",
    overview:
      "Doctoral research at the interface of engineering and medicine, jointly offered by IIT Jodhpur and AIIMS Jodhpur, with emphasis on translational R&D towards deployable techniques, technologies, devices and systems.",
    eligibility: SHARED_ELIGIBILITY,
    curriculum: SHARED_CURRICULUM,
    clinicalExposure: "Jointly delivered with AIIMS Jodhpur.",
    admission: [
      { label: "Admissions A.Y. 2026–27", url: ADMISSION },
      { label: "Apply online (PhD)", url: "https://erponline.iitj.ac.in/Admission/index?admiss_ch=01" },
    ],
    cohortsUrl: "https://www.iitj.ac.in/medical-technologies/en/phd-medical-technologies",
  },
  {
    id: "dual-degree",
    slug: "dual-degree-medical-technologies",
    status: "published",
    provenance: "verified",
    sourceUrl: HOME,
    title: "Dual Degree in Medical Technologies",
    shortTitle: "Dual Degree",
    degree: "Dual Degree",
    // Discontinued — no longer offered for new admissions (per the department, Sep 2026;
    // the official site still lists its 2020–2025 cohorts).
    availability: "discontinued",
    intakeYears: "2020–2025",
    overview:
      "No longer offered for new admissions. Students were admitted to the Dual Degree in Medical Technologies from 2020 to 2025; their cohorts remain part of the Center's student register.",
    cohortsUrl: "https://www.iitj.ac.in/medical-technologies/en/dual-degree-medical-technologies",
  },
];
