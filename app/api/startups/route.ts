import { NextRequest, NextResponse } from "next/server";
import { StartupRepository } from "@/lib/portal/repositories/startups";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { StartupStatus } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await StartupRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await StartupRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch startups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const startup_name = (formData.get("startup_name") as string) || "";
    const founder_role = (formData.get("founder_role") as string) || "Founder";
    const cofounders = (formData.get("cofounders") as string) || "";
    const domain = (formData.get("domain") as string) || "Healthcare & Medical Technology";
    const description = (formData.get("description") as string) || "";
    const founded_year = (formData.get("founded_year") as string) || "";
    const website = (formData.get("website") as string) || "";
    const current_status = (formData.get("current_status") as StartupStatus) || "Pre-Incubatee";
    const incubator = (formData.get("incubator") as string) || "IIT Jodhpur TISC / AIIMS Jodhpur";
    const funding = (formData.get("funding") as string) || "";

    if (!roll_number || !startup_name) {
      return NextResponse.json({ success: false, error: "Roll number and startup name are required." }, { status: 400 });
    }

    let document_url = "";
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const v = validateUploadedFile(file);
      if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });

      const year = founded_year || new Date().getFullYear();
      const filename = generateDocumentFilename(roll_number, "STARTUP", startup_name, year, file.name);

      const buf = Buffer.from(await file.arrayBuffer());
      if (isGoogleConfigured()) {
        try {
          const res = await uploadDocumentToDrive(buf, filename, file.type, roll_number, "Startups");
          document_url = res.webViewLink;
        } catch {
          document_url = `https://drive.google.com/file/d/sim-stu-${Date.now()}/view`;
        }
      } else {
        document_url = `https://drive.google.com/file/d/local-stu-${Date.now()}/view`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Startups",
        original_filename: file.name,
        generated_filename: filename,
        file_type: file.type,
        file_size: file.size,
        drive_file_id: `stu-${Date.now()}`,
        drive_url: document_url,
      });
    }

    const item = await StartupRepository.create({
      roll_number,
      startup_name,
      founder_role,
      cofounders,
      domain,
      description,
      founded_year,
      website,
      current_status,
      incubator,
      funding,
      document_url,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "STARTUP_ADDED",
      module: "Startups",
      record_id: item.record_id,
      status: "SUCCESS",
      description: `Added startup venture "${startup_name}" (${current_status})`,
    });

    return NextResponse.json({ success: true, data: item, message: "Startup venture added successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to add startup." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required." }, { status: 400 });
    }

    const existing = await StartupRepository.getById(id);
    const deleted = await StartupRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Startup record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Startups",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted startup '${existing.startup_name.slice(0, 50)}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Startup venture removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete startup." }, { status: 500 });
  }
}

