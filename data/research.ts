import type { ResearchArea } from "@/lib/types";

// Research themes are *derived* from the officially listed research interests of the
// Centre's affiliated faculty (see data/people.ts). They are editorial groupings,
// not an official taxonomy — confirm naming with the Centre before launch.
const SRC = "https://www.iitj.ac.in/People?dept=Medical-Technologies";

const area = (a: Omit<ResearchArea, "status" | "provenance" | "sourceUrl" | "slug">): ResearchArea => ({
  ...a,
  slug: a.id,
  status: "published",
  provenance: "verified",
  sourceUrl: SRC,
});

export const researchAreas: ResearchArea[] = [
  area({
    id: "sensors-diagnostics",
    title: "Biosensors & Point-of-Care Diagnostics",
    shortTitle: "Sensors & Diagnostics",
    summary:
      "Micro- and nano-scale sensing, MEMS and microfluidics aimed at early, low-cost diagnosis close to the patient — from gas and bio-sensors to flexible, wearable and self-powered devices.",
    keywords: ["MEMS", "Microfluidics", "Bio & gas sensors", "Flexible electronics", "Early diagnostics"],
    facultyIds: ["ajay-agarwal", "saakshi-dhanekar", "akshay-moudgil", "shrutidhara-sarma", "ankur-gupta"],
  }),
  area({
    id: "imaging-ai",
    title: "Medical Imaging & Healthcare AI",
    shortTitle: "Imaging & AI",
    summary:
      "Image, video and signal processing with deep learning for biomedical data — built around responsible AI and applications such as medical cell image analysis for precision oncology.",
    keywords: ["Medical imaging", "Deep learning", "Responsible AI", "Signal processing"],
    facultyIds: ["deepak-mishra", "anil-kumar-tiwari", "siddharth-srivastava"],
  }),
  area({
    id: "rehab-robotics",
    title: "Rehabilitation & Medical Robotics",
    shortTitle: "Robotics & Rehabilitation",
    summary:
      "Bionic prosthetics, assistive and lower-limb rehabilitation robots, robotic therapy systems and the human–robot interaction that makes them usable in care.",
    keywords: ["Prosthetics", "Assistive robotics", "Rehabilitation", "Human–robot interaction"],
    facultyIds: ["bhivraj-suthar", "jayant-kumar-mohanta"],
  }),
  area({
    id: "nanomedicine-biomaterials",
    title: "Nanomedicine & Biomaterials",
    shortTitle: "Nanomedicine & Biomaterials",
    summary:
      "Nanobiotechnology, drug delivery, theranostics and photomedicine, grounded in cell and molecular physiology and in the design of materials that work inside the body.",
    keywords: ["Drug delivery", "Theranostics", "Photomedicine", "Biomaterials"],
    facultyIds: ["raviraj-vankayala", "sushmita-jha", "jaiveer-singh", "sagar-kumar-verma"],
  }),
  area({
    id: "manufacturing-design",
    title: "Device Design & Advanced Manufacturing",
    shortTitle: "Design & Manufacturing",
    summary:
      "Industrial design, microsystems fabrication and additive manufacturing — the disciplines that turn a validated concept into a device that can be built, used and trusted.",
    keywords: ["Industrial design", "Additive manufacturing", "Microfabrication", "Composites"],
    facultyIds: ["gaurav-vinod-vaidya", "mrityunjay-doddamani", "ankur-gupta", "jaiveer-singh"],
  }),
  area({
    id: "digital-health",
    title: "Digital Health & Health Systems",
    shortTitle: "Digital & Public Health",
    summary:
      "Health systems, health economics and equity alongside IoT, software systems and security — making sure technology reaches patients at scale, safely.",
    keywords: ["Public health", "Health economics", "IoT", "Security & privacy"],
    facultyIds: ["alok-ranjan", "sumit-kalra", "mohit-kumar-jangid"],
  }),
];
