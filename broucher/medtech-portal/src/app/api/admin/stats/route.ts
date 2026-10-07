import { NextResponse } from "next/server";
import { StudentRepository } from "@/lib/repositories/students";
import { PublicationRepository } from "@/lib/repositories/publications";
import { PatentRepository } from "@/lib/repositories/patents";
import { ProjectRepository } from "@/lib/repositories/projects";
import { InternshipRepository } from "@/lib/repositories/internships";
import { AchievementRepository } from "@/lib/repositories/achievements";
import { ConferenceRepository } from "@/lib/repositories/conferences";
import { StartupRepository } from "@/lib/repositories/startups";
import { DocumentRepository } from "@/lib/repositories/documents";
import { AuditRepository } from "@/lib/repositories/audit";
import { isGoogleConfigured } from "@/lib/google/auth";

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
    ]);

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
        isGoogleConfigured: isGoogleConfigured(),
        recentLogs: auditLogs.slice(0, 15),
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
