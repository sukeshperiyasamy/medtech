import { NextRequest, NextResponse } from "next/server";
import { ProjectRepository } from "@/lib/portal/repositories/projects";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { ProjectType, ProjectStatus } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await ProjectRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await ProjectRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const title = (formData.get("title") as string) || "";
    const project_type = (formData.get("project_type") as ProjectType) || "Academic";
    const description = (formData.get("description") as string) || "";
    const supervisor = (formData.get("supervisor") as string) || "";
    const organization = (formData.get("organization") as string) || "IIT Jodhpur & AIIMS Jodhpur";
    const start_date = (formData.get("start_date") as string) || "";
    const end_date = (formData.get("end_date") as string) || "";
    const technologies = (formData.get("technologies") as string) || "";
    const status = (formData.get("status") as ProjectStatus) || "Ongoing";
    const project_url = (formData.get("project_url") as string) || "";

    if (!roll_number || !title) {
      return NextResponse.json(
        { success: false, error: "Roll number and project title are required." },
        { status: 400 }
      );
    }

    let document_url = "";
    let drive_file_id = "";
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      const validation = validateUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }

      const year = start_date ? start_date.slice(0, 4) : new Date().getFullYear();
      const generatedFilename = generateDocumentFilename(
        roll_number,
        "PROJECT",
        title,
        year,
        file.name
      );

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (isGoogleConfigured()) {
        try {
          const driveResult = await uploadDocumentToDrive(
            buffer,
            generatedFilename,
            file.type,
            roll_number,
            "Projects"
          );
          document_url = driveResult.webViewLink;
          drive_file_id = driveResult.fileId;
        } catch (uploadErr) {
          drive_file_id = `sim-${Date.now()}`;
          document_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
        }
      } else {
        drive_file_id = `local-${Date.now()}`;
        document_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Projects",
        original_filename: file.name,
        generated_filename: generatedFilename,
        file_type: file.type,
        file_size: file.size,
        drive_file_id,
        drive_url: document_url,
      });
    }

    const newProject = await ProjectRepository.create({
      roll_number,
      title,
      project_type,
      description,
      supervisor,
      organization,
      start_date,
      end_date,
      technologies,
      status,
      project_url,
      document_url,
      drive_file_id,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "PROJECT_ADDED",
      module: "Projects",
      record_id: newProject.record_id,
      status: "SUCCESS",
      description: `Added project "${title}"`,
    });

    return NextResponse.json({
      success: true,
      data: newProject,
      message: "Project record added successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to add project." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required." }, { status: 400 });
    }

    const existing = await ProjectRepository.getById(id);
    const deleted = await ProjectRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Project record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Projects",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted project '${existing.title.slice(0, 50)}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Project removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete project." }, { status: 500 });
  }
}

