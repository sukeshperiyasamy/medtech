import type { CollaborationPathway } from "@/lib/types";

const mail = (subject: string) =>
  `mailto:office_medtechcentre@iitj.ac.in?subject=${encodeURIComponent(subject)}`;

export const pathways: CollaborationPathway[] = [
  { id: "researchers", audience: "Researchers", title: "Collaborative research", description: "Co-develop projects with engineering and clinical faculty across IIT Jodhpur and AIIMS Jodhpur.", cta: { label: "Propose a collaboration", url: mail("Research collaboration") } },
  { id: "clinicians", audience: "Clinicians", title: "Clinical needs & validation", description: "Bring an unmet need from practice, and help validate the technologies built to meet it.", cta: { label: "Share a clinical need", url: mail("Clinical need") } },
  { id: "industry", audience: "Industry", title: "Technology development", description: "Sponsored research, co-development and access to interdisciplinary talent.", cta: { label: "Talk to the Centre", url: mail("Industry partnership") } },
  { id: "innovators", audience: "Innovators", title: "Translation & entrepreneurship", description: "Prototyping, technology management and a path from validated idea to venture.", cta: { label: "Start a conversation", url: mail("Innovation & translation") } },
  { id: "funders", audience: "Funders", title: "Support high-impact research", description: "Back medical technologies designed from the outset for clinical use in India.", cta: { label: "Explore support", url: mail("Funding support") } },
];
