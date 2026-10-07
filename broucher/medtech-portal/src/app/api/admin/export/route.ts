import { NextRequest, NextResponse } from "next/server";
import { StudentRepository } from "@/lib/repositories/students";
import { PublicationRepository } from "@/lib/repositories/publications";
import { PatentRepository } from "@/lib/repositories/patents";
import { ProjectRepository } from "@/lib/repositories/projects";
import { InternshipRepository } from "@/lib/repositories/internships";
import { AchievementRepository } from "@/lib/repositories/achievements";
import { ConferenceRepository } from "@/lib/repositories/conferences";
import { StartupRepository } from "@/lib/repositories/startups";
import { DocumentRepository } from "@/lib/repositories/documents";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

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
    ]);

    const data = {
      exported_at: new Date().toISOString(),
      institution: "Centre for Medical Technologies (IDRP) | IIT Jodhpur & AIIMS Jodhpur",
      portal: "MedTech Student Data Portal",
      students,
      publications,
      patents,
      projects,
      internships,
      achievements,
      conferences,
      startups,
      documents,
    };

    if (format === "csv") {
      // Return student CSV
      const headers = Object.keys(students[0] || {}).join(",");
      const rows = students.map((s: any) =>
        Object.values(s)
          .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
          .join(",")
      );
      const csv = [headers, ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="medtech_students.csv"',
        },
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to export dataset" }, { status: 500 });
  }
}
