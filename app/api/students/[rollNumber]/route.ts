import { NextRequest, NextResponse } from "next/server";
import { StudentRepository } from "@/lib/portal/repositories/students";
import { PublicationRepository } from "@/lib/portal/repositories/publications";
import { PatentRepository } from "@/lib/portal/repositories/patents";
import { ProjectRepository } from "@/lib/portal/repositories/projects";
import { InternshipRepository } from "@/lib/portal/repositories/internships";
import { AchievementRepository } from "@/lib/portal/repositories/achievements";
import { ConferenceRepository } from "@/lib/portal/repositories/conferences";
import { StartupRepository } from "@/lib/portal/repositories/startups";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { Student } from "@/lib/portal/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  try {
    const { rollNumber } = await params;
    if (!rollNumber) {
      return NextResponse.json({ success: false, error: "Roll number is required" }, { status: 400 });
    }

    const student = await StudentRepository.getByRollNumber(rollNumber);
    if (!student) {
      return NextResponse.json({ success: false, error: `Student with Roll Number '${rollNumber}' not found.` }, { status: 404 });
    }

    // Parallel fetch counts for dashboard
    const [
      publications,
      patents,
      projects,
      internships,
      achievements,
      conferences,
      startups,
      documents,
    ] = await Promise.all([
      PublicationRepository.getByRollNumber(rollNumber),
      PatentRepository.getByRollNumber(rollNumber),
      ProjectRepository.getByRollNumber(rollNumber),
      InternshipRepository.getByRollNumber(rollNumber),
      AchievementRepository.getByRollNumber(rollNumber),
      ConferenceRepository.getByRollNumber(rollNumber),
      StartupRepository.getByRollNumber(rollNumber),
      DocumentRepository.getByRollNumber(rollNumber),
    ]);

    const counts = {
      publications: publications.length,
      patents: patents.length,
      projects: projects.length,
      internships: internships.length,
      achievements: achievements.length,
      conferences: conferences.length,
      startups: startups.length,
      documents: documents.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        student,
        counts,
      },
    });
  } catch (error: any) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load student details. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ rollNumber: string }> }
) {
  try {
    const { rollNumber } = await params;
    const body = (await request.json()) as Record<string, any>;

    const existing = await StudentRepository.getByRollNumber(rollNumber);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    // Disallow altering primary roll_number
    const updatable: Partial<Student> = { ...body };
    delete updatable.roll_number;
    delete updatable.student_id;

    const updated = await StudentRepository.update(rollNumber, updatable);

    await AuditRepository.log({
      user: existing.email || rollNumber,
      roll_number: rollNumber,
      action: "PROFILE_UPDATED",
      module: "Profile",
      record_id: rollNumber,
      status: "SUCCESS",
      description: `Updated profile details for ${existing.name} (${rollNumber})`,
    });

    return NextResponse.json({ success: true, data: updated, message: "Profile updated successfully." });
  } catch (error: any) {
    console.error("Error updating student profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
