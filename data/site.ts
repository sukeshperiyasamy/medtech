import type { SiteConfig } from "@/lib/types";

// Source: https://www.iitj.ac.in/medical-technologies/en/contact
export const site: SiteConfig = {
  name: "Medical Technology Centre",
  shortName: "MedTech Centre",
  parent: "IIT Jodhpur",
  tagline: "Engineering the future of medicine",
  // The Centre is an IIT Jodhpur centre; its verticals are the Medical Technologies Program
  // (jointly with AIIMS Jodhpur) and the Centre for Digital Health (per the Head, Sep 2026).
  description:
    "The Medical Technology Centre at IIT Jodhpur — home to the Medical Technologies Program, run jointly with AIIMS Jodhpur, and the Centre for Digital Health.",
  url: "https://www.iitj.ac.in/medical-technologies",
  email: "office_medtechcentre@iitj.ac.in",
  phone: "0291 280 1044",
  address: [
    "Medical Technology Centre, W16 Berm",
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
      url: "https://aiimsjodhpur.edu.in/",
      logo: {
        src: "/logos/aiims-jodhpur-seal.png",
        alt: "AIIMS Jodhpur official seal",
        width: 320,
        height: 320,
      },
    },
  ],
  // TODO(content): add official social profiles once confirmed by the Centre.
  social: [],
  nav: [
    { label: "About", href: "/about" },
    {
      label: "Verticals",
      href: "/medical-technologies",
      children: [
        { label: "Medical Technologies Program", href: "/medical-technologies", description: "Joint programme with AIIMS Jodhpur" },
        { label: "Programmes & admissions", href: "/programs", description: "Master's and PhD in Medical Technologies" },
        { label: "Centre for Digital Health", href: "/digital-health", description: "Health equity through digital transformation" },
      ],
    },
    {
      label: "Research",
      href: "/research",
      children: [
        { label: "Research areas", href: "/research", description: "Six themes across sensing, imaging, robotics and more" },
        { label: "Innovation", href: "/research#innovation", description: "Projects moving from lab to clinic" },
        { label: "Funding", href: "/funding", description: "Grants and opportunities for medtech work" },
      ],
    },
    { label: "Startups", href: "/startups" },
    {
      label: "People",
      href: "/people",
      children: [
        { label: "Faculty & staff", href: "/people", description: "Leadership, affiliated and visiting faculty" },
        { label: "Students & alumni", href: "/students", description: "Every cohort since 2020" },
        { label: "Achievements", href: "/achievements", description: "Medals, fellowships and awards" },
      ],
    },
    {
      label: "News",
      href: "/news",
      children: [
        { label: "News & events", href: "/news", description: "Conferences, admissions and announcements" },
        { label: "Gallery", href: "/gallery", description: "All photographs from the Centre" },
      ],
    },
  ],
  announcement: {
    tag: "Admissions 2026–27",
    label: "Results of the Master's and PhD admissions in Medical Technologies are out",
    url: "https://www.iitj.ac.in/medical-technologies/en/medical-technologies",
  },
};
