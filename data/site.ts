import type { SiteConfig } from "@/lib/types";

// Source: https://www.iitj.ac.in/medical-technologies/en/contact
export const site: SiteConfig = {
  name: "Medical Technologies Center",
  shortName: "MedTech Center",
  partners: "IIT Jodhpur × AIIMS Jodhpur",
  tagline: "Engineering the future of medicine",
  // Official programme positioning, from the IIT Jodhpur Medical Technologies home page.
  description:
    "A multi-disciplinary program to produce deep-tech innovators in the field of Medical Technologies — jointly offered by IIT Jodhpur and AIIMS Jodhpur.",
  url: "https://www.iitj.ac.in/medical-technologies",
  email: "office_medtechcentre@iitj.ac.in",
  phone: "0291 280 1044",
  address: [
    "Medical Technology Centre",
    "Indian Institute of Technology Jodhpur",
    "NH 62, Nagaur Road, Karwar",
    "Jodhpur 342030, Rajasthan, India",
  ],
  mapUrl: "https://maps.app.goo.gl/E4e6rbcTydaJZyiX9",
  officialUrl: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies",
  institutions: [
    {
      name: "IIT Jodhpur",
      url: "https://www.iitj.ac.in",
      logo: { src: "/logos/iitj-logo.jpg", alt: "IIT Jodhpur logo", width: 495, height: 546 },
    },
    {
      name: "AIIMS Jodhpur",
      url: "https://www.aiimsjodhpur.edu.in",
      logo: {
        src: "/logos/aiims-jodhpur-seal.png",
        alt: "AIIMS Jodhpur official seal",
        width: 320,
        height: 320,
      },
    },
  ],
  // TODO(content): add official social profiles once confirmed by the Center.
  social: [],
  nav: [
    { label: "About", href: "#about" },
    { label: "Research", href: "#research" },
    { label: "Innovation", href: "#innovation" },
    { label: "Programs", href: "#programs" },
    { label: "Funding", href: "#funding" },
    { label: "People", href: "#people" },
    { label: "Impact", href: "#impact" },
    { label: "News", href: "#news" },
  ],
  announcement: {
    tag: "Admissions 2026–27",
    label: "Results of the Master's and PhD admissions in Medical Technologies are out",
    url: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies",
  },
};
