import { NextResponse } from "next/server";
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
import { SubmissionRepository } from "@/lib/portal/repositories/submissions";
import { isGoogleConfigured } from "@/lib/portal/google/auth";

export async function GET() {
  try {
    const [
      students,
      publications,
      patents,
      projects,
      internships,
      achievements,
      conferences,
      startups,
      documents,
      auditLogs,
      submissions,
    ] = await Promise.all([
      StudentRepository.getAll(),
      PublicationRepository.getAll(),
      PatentRepository.getAll(),
      ProjectRepository.getAll(),
      InternshipRepository.getAll(),
      AchievementRepository.getAll(),
      ConferenceRepository.getAll(),
      StartupRepository.getAll(),
      DocumentRepository.getAll(),
      AuditRepository.getAll(),
      SubmissionRepository.getAll(),
    ]);

    const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: students.length,
        totalPublications: publications.length,
        totalPatents: patents.length,
        totalProjects: projects.length,
        totalInternships: internships.length,
        totalAchievements: achievements.length,
        totalConferences: conferences.length,
        totalStartups: startups.length,
        totalDocuments: documents.length,
        totalSubmissions: submissions.length,
        pendingSubmissions: pendingCount,
        isGoogleConfigured: isGoogleConfigured(),
        recentLogs: auditLogs.slice(0, 15),
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
