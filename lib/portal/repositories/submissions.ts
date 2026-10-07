import { Student, StudentSubmission, SubmissionStatus } from "@/lib/portal/types";
import { getLocalStore } from "@/lib/portal/repositories/store";
import { StudentRepository } from "@/lib/portal/repositories/students";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { calculateStudentCompleteness } from "@/lib/portal/completeness";

export class SubmissionRepository {
  static async getAll(): Promise<StudentSubmission[]> {
    const store = getLocalStore();
    return store.submissions;
  }

  static async getById(submissionId: string): Promise<StudentSubmission | null> {
    const store = getLocalStore();
    return store.submissions.find((s) => s.submission_id === submissionId) || null;
  }

  static async submit(payload: Partial<Student>, sourceUser: string = "Google Form / Master Sync"): Promise<StudentSubmission> {
    const store = getLocalStore();
    const rawRoll = (payload.roll_number || "").trim().toUpperCase();
    if (!rawRoll) {
      throw new Error("Roll Number is required for master submission matching.");
    }

    const nextId = `SUB-${String(store.submissions.length + 1).padStart(3, "0")}`;
    const timestamp = new Date().toISOString();

    // Normalize common Google Form field aliases
    const pAny = payload as Record<string, any>;
    if (pAny.dob && !payload.date_of_birth) payload.date_of_birth = pAny.dob;
    if (pAny.mobile && !payload.phone) payload.phone = pAny.mobile;
    if (pAny.linkedin && !payload.linkedin_url) payload.linkedin_url = pAny.linkedin;
    if (pAny.github && !payload.github_url) payload.github_url = pAny.github;
    if (pAny.orcid && !payload.orcid_id) payload.orcid_id = pAny.orcid;

    // Match existing student
    const existing = await StudentRepository.getByRollNumber(rawRoll);

    // Check mandatory fields (taking existing record values into account for updates)
    const missingMandatory: string[] = [];
    const effectiveName = payload.name?.trim() || existing?.name?.trim();
    const effectiveEmail = payload.email?.trim() || existing?.email?.trim();
    const effectiveDegree = payload.degree?.trim() || existing?.degree?.trim();

    if (!effectiveName) missingMandatory.push("Full Name");
    if (!effectiveEmail) missingMandatory.push("Institute Email");
    if (!effectiveDegree) missingMandatory.push("Degree / Programme");

    let submissionType: SubmissionStatus = "NEW";
    const diffFields: string[] = [];

    if (existing) {
      // Compare fields to detect update vs duplicate
      let hasChanges = false;
      const keysToCompare: (keyof Student)[] = [
        "name", "email", "phone", "date_of_birth", "degree", "department",
        "batch", "specialization", "supervisor", "address", "city", "state", "pincode",
        "official_name", "nationality", "personal_email", "alt_phone",
        "research_interests", "thesis_title", "technical_skills", "research_areas",
        "linkedin_url", "github_url", "google_scholar_url", "orcid_id", "portfolio_url"
      ];

      for (const k of keysToCompare) {
        const newVal = payload[k];
        const oldVal = existing[k];
        if (newVal !== undefined && newVal !== null && String(newVal).trim() !== "") {
          if (String(newVal).trim() !== String(oldVal || "").trim()) {
            hasChanges = true;
            diffFields.push(String(k));
          }
        }
      }

      if (hasChanges) {
        submissionType = missingMandatory.length > 0 ? "NEEDS_REVIEW" : "UPDATE";
      } else {
        submissionType = "DUPLICATE";
      }
    } else {
      submissionType = missingMandatory.length > 0 ? "NEEDS_REVIEW" : "NEW";
    }

    const submission: StudentSubmission = {
      submission_id: nextId,
      roll_number: rawRoll,
      submitted_at: timestamp,
      submission_type: submissionType,
      raw_payload: payload,
      existing_record: existing ? { ...existing } : undefined,
      diff_fields: diffFields,
      missing_mandatory: missingMandatory,
      status: "PENDING",
    };

    store.submissions.unshift(submission);

    await AuditRepository.log({
      user: sourceUser,
      roll_number: rawRoll,
      action: "SUBMISSION_RECEIVED",
      module: "Master Submissions",
      record_id: nextId,
      status: "SUCCESS",
      description: `Master data submission received for ${rawRoll} (${submissionType}). Changed fields: ${diffFields.length}`,
    });

    return submission;
  }

  static async approve(submissionId: string, reviewer: string = "Admin Desk"): Promise<{ success: boolean; student: Student }> {
    const store = getLocalStore();
    const submission = store.submissions.find((s) => s.submission_id === submissionId);
    if (!submission) throw new Error("Submission record not found");

    const roll = submission.roll_number;
    const existing = await StudentRepository.getByRollNumber(roll);
    const now = new Date().toISOString();

    let updatedStudent: Student;

    if (existing) {
      // Merge: Update existing record without destroying verified institutional identity
      const mergedData: Partial<Student> = {
        ...submission.raw_payload,
        verification_status: "Verified",
        verified_at: now,
        verified_by: reviewer,
        updated_at: now,
      };
      // Keep verified roll_number immutable
      mergedData.roll_number = existing.roll_number;
      mergedData.student_id = existing.student_id;

      const res = await StudentRepository.update(roll, mergedData);
      if (!res) throw new Error("Failed to update student profile");
      updatedStudent = res;
    } else {
      // Create new student
      const newRecord: Student = {
        student_id: roll,
        roll_number: roll,
        name: submission.raw_payload.name || "Scholar",
        email: submission.raw_payload.email || `${roll.toLowerCase()}@iitj.ac.in`,
        phone: submission.raw_payload.phone || "",
        date_of_birth: submission.raw_payload.date_of_birth || "",
        gender: submission.raw_payload.gender || "Other",
        degree: submission.raw_payload.degree || "M.Tech – Medical Technology",
        department: submission.raw_payload.department || "Centre for Medical Technologies (IDRP)",
        batch: submission.raw_payload.batch || "2024",
        specialization: submission.raw_payload.specialization || "Medical Technology",
        graduation_year: submission.raw_payload.graduation_year || "2026",
        supervisor: submission.raw_payload.supervisor || "Faculty Board (IDRP)",
        address: submission.raw_payload.address || "IIT Jodhpur Campus",
        city: submission.raw_payload.city || "Jodhpur",
        state: submission.raw_payload.state || "Rajasthan",
        pincode: submission.raw_payload.pincode || "342030",
        status: "Active",
        verification_status: "Verified",
        verified_at: now,
        verified_by: reviewer,
        ...submission.raw_payload,
      };

      updatedStudent = await StudentRepository.create(newRecord);
    }

    submission.status = "APPROVED";
    submission.reviewed_by = reviewer;
    submission.reviewed_at = now;

    await AuditRepository.log({
      user: reviewer,
      roll_number: roll,
      action: "SUBMISSION_APPROVED",
      module: "Master Submissions",
      record_id: submissionId,
      status: "SUCCESS",
      description: `Approved master profile for ${roll} (${submission.submission_type})`,
    });

    return { success: true, student: updatedStudent };
  }

  static async reject(submissionId: string, reviewer: string = "Admin Desk", reason: string): Promise<boolean> {
    const store = getLocalStore();
    const submission = store.submissions.find((s) => s.submission_id === submissionId);
    if (!submission) return false;

    const now = new Date().toISOString();
    submission.status = "REJECTED";
    submission.review_notes = reason;
    submission.reviewed_by = reviewer;
    submission.reviewed_at = now;

    await AuditRepository.log({
      user: reviewer,
      roll_number: submission.roll_number,
      action: "SUBMISSION_REJECTED",
      module: "Master Submissions",
      record_id: submissionId,
      status: "WARNING",
      description: `Rejected submission for ${submission.roll_number}. Reason: ${reason}`,
    });

    return true;
  }

  static async requestCorrection(submissionId: string, reviewer: string = "Admin Desk", notes: string): Promise<boolean> {
    const store = getLocalStore();
    const submission = store.submissions.find((s) => s.submission_id === submissionId);
    if (!submission) return false;

    const now = new Date().toISOString();
    submission.status = "CORRECTION_REQUESTED";
    submission.review_notes = notes;
    submission.reviewed_by = reviewer;
    submission.reviewed_at = now;

    const existing = await StudentRepository.getByRollNumber(submission.roll_number);
    if (existing) {
      await StudentRepository.update(submission.roll_number, {
        verification_status: "Needs Correction",
        review_notes: notes,
      });
    }

    await AuditRepository.log({
      user: reviewer,
      roll_number: submission.roll_number,
      action: "SUBMISSION_CORRECTION_REQUESTED",
      module: "Master Submissions",
      record_id: submissionId,
      status: "WARNING",
      description: `Requested correction for ${submission.roll_number}. Notes: ${notes}`,
    });

    return true;
  }

  static async mergeDuplicate(submissionId: string, reviewer: string = "Admin Desk"): Promise<boolean> {
    // Merges safe non-empty details into existing record
    return (await this.approve(submissionId, reviewer)).success;
  }
}
