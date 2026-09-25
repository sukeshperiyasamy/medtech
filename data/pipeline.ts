import type { PipelineStage } from "@/lib/types";

// The Centre's translational model, expressed as editorial copy (not factual claims).
export const pipeline: PipelineStage[] = [
  { id: "need", index: 1, title: "Clinical Need", question: "What problem do patients and clinicians actually face?", description: "Unmet needs are identified at the bedside — through clinical immersion at AIIMS Jodhpur — before a single line is drawn.", who: "Clinicians · Students", accent: "blue" },
  { id: "research", index: 2, title: "Research", question: "What does the science already say?", description: "The need becomes a research question, investigated across medicine, engineering, materials and data.", who: "Faculty · PhD scholars", accent: "cyan" },
  { id: "ideation", index: 3, title: "Ideation", question: "Which approaches could work?", description: "Mixed teams of medical and engineering graduates generate and filter concepts against clinical reality.", who: "Joint cohorts", accent: "blue" },
  { id: "engineering", index: 4, title: "Engineering", question: "How do we build it well?", description: "Sensors, electronics, mechanisms, software and AI are engineered to a specification set by the clinic.", who: "IIT Jodhpur labs", accent: "cyan" },
  { id: "prototype", index: 5, title: "Prototype", question: "Does it work outside the drawing?", description: "Design and advanced manufacturing turn the concept into a device, process, product or protocol.", who: "Design & fabrication", accent: "blue" },
  { id: "validation", index: 6, title: "Validation", question: "Is it safe, accurate and useful?", description: "Prototypes are tested against clinical evidence with the clinicians who defined the need.", who: "AIIMS Jodhpur", accent: "teal" },
  { id: "funding", index: 7, title: "Funding", question: "How does it keep moving?", description: "Grants, sponsored research and start-up support carry validated work across the gap to the market.", who: "Agencies · Industry", accent: "cyan" },
  { id: "translation", index: 8, title: "Translation", question: "How does it reach people?", description: "Technology management and entrepreneurship turn a validated technology into a deployable product or venture.", who: "Innovators · Start-ups", accent: "blue" },
  { id: "impact", index: 9, title: "Impact", question: "Did care get better?", description: "Globally competitive medical technologies that address current and emerging healthcare challenges.", who: "Patients · Health systems", accent: "teal" },
];
