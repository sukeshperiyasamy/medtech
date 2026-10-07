import { Student, StudentCompleteness, SectionCompleteness } from "@/lib/portal/types";

const NA_VALUES = new Set(["none", "n/a", "not applicable", "nil", "na", "-", "not applicable / none"]);

export function isAnswered(val?: string | null): boolean {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();
  if (trimmed === "" || trimmed === "To be allocated" || trimmed === "Faculty Board (IDRP)") {
    return false;
  }
  return true;
}

export function isNotApplicableOrAnswered(val?: string | null): boolean {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim().toLowerCase();
  if (trimmed === "") return false;
  if (NA_VALUES.has(trimmed)) return true; // valid explicit 'None/N/A'
  return true;
}

export function calculateStudentCompleteness(student: Student): StudentCompleteness {
  // 1. Personal
  const personalDefs: { key: keyof Student; label: string; mandatory?: boolean }[] = [
    { key: "name", label: "Full Name", mandatory: true },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Institute Email", mandatory: true },
    { key: "phone", label: "Mobile Number" },
    { key: "city", label: "City & Address Details" },
  ];

  const personalMissing: string[] = [];
  let personalDone = 0;
  for (const def of personalDefs) {
    if (isAnswered(student[def.key] as string)) {
      personalDone++;
    } else {
      personalMissing.push(def.label);
    }
  }
  const personalScore = Math.round((personalDone / personalDefs.length) * 100);

  // 2. Academic
  const academicDefs: { key: keyof Student; label: string; mandatory?: boolean }[] = [
    { key: "roll_number", label: "Roll Number", mandatory: true },
    { key: "degree", label: "Degree / Programme", mandatory: true },
    { key: "department", label: "Department / Centre" },
    { key: "batch", label: "Batch / Admission Year" },
    { key: "graduation_year", label: "Expected Graduation Year" },
    { key: "supervisor", label: "Supervisor / Guide" },
    { key: "specialization", label: "Specialization" },
  ];

  const academicMissing: string[] = [];
  let academicDone = 0;
  for (const def of academicDefs) {
    if (isAnswered(student[def.key] as string)) {
      academicDone++;
    } else {
      academicMissing.push(def.label);
    }
  }
  const academicScore = Math.round((academicDone / academicDefs.length) * 100);

  // 3. Research
  // Note: Student is NOT penalized if research interests/thesis/skills are explicit 'None' or 'N/A'
  const researchDefs: { key: keyof Student; label: string }[] = [
    { key: "specialization", label: "Research Areas / Specialization" },
    { key: "research_interests", label: "Research Interests" },
    { key: "thesis_title", label: "Thesis / Project Title" },
    { key: "technical_skills", label: "Technical Skills" },
  ];

  const researchMissing: string[] = [];
  let researchDone = 0;
  for (const def of researchDefs) {
    const val = student[def.key] as string;
    if (isNotApplicableOrAnswered(val)) {
      researchDone++;
    } else {
      researchMissing.push(def.label);
    }
  }
  const researchScore = Math.round((researchDone / researchDefs.length) * 100);

  // 4. Professional
  const professionalDefs: { key: keyof Student; label: string }[] = [
    { key: "linkedin_url", label: "LinkedIn Profile" },
    { key: "github_url", label: "GitHub / Portfolio URL" },
    { key: "google_scholar_url", label: "Google Scholar / ORCID" },
    { key: "work_experience", label: "Work / Clinical Experience" },
  ];

  const professionalMissing: string[] = [];
  let professionalDone = 0;
  for (const def of professionalDefs) {
    const val = student[def.key] as string;
    if (isNotApplicableOrAnswered(val)) {
      professionalDone++;
    } else {
      professionalMissing.push(def.label);
    }
  }
  const professionalScore = Math.round((professionalDone / professionalDefs.length) * 100);

  // Weighted overall calculation:
  // Personal (30%) + Academic (35%) + Research (20%) + Professional (15%)
  const overall = Math.round(
    personalScore * 0.3 +
    academicScore * 0.35 +
    researchScore * 0.2 +
    professionalScore * 0.15
  );

  const missingMandatory: string[] = [];
  if (!isAnswered(student.name)) missingMandatory.push("Full Name");
  if (!isAnswered(student.roll_number)) missingMandatory.push("Roll Number");
  if (!isAnswered(student.email)) missingMandatory.push("Institute Email");
  if (!isAnswered(student.degree)) missingMandatory.push("Degree / Programme");

  return {
    overall,
    personal: {
      score: personalScore,
      totalFields: personalDefs.length,
      completedFields: personalDone,
      missingFields: personalMissing,
    },
    academic: {
      score: academicScore,
      totalFields: academicDefs.length,
      completedFields: academicDone,
      missingFields: academicMissing,
    },
    research: {
      score: researchScore,
      totalFields: researchDefs.length,
      completedFields: researchDone,
      missingFields: researchMissing,
    },
    professional: {
      score: professionalScore,
      totalFields: professionalDefs.length,
      completedFields: professionalDone,
      missingFields: professionalMissing,
    },
    missingMandatory,
  };
}

export function renderAsciiProgressBar(percent: number, length: number = 18): string {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty) + ` ${clamped}%`;
}
