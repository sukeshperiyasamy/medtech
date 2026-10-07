import { NextRequest, NextResponse } from "next/server";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { StudentRepository } from "@/lib/portal/repositories/students";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { DocumentCategory } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await DocumentRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await DocumentRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const category = (formData.get("category") as DocumentCategory) || "Other";
    const record_id = (formData.get("record_id") as string) || "GENERAL";
    const short_title = (formData.get("short_title") as string) || "DOCUMENT";
    const file = formData.get("file") as File | null;

    if (!roll_number || !file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Roll number and document file are required." },
        { status: 400 }
      );
    }

    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const generatedFilename = generateDocumentFilename(
      roll_number,
      category,
      short_title,
      year,
      file.name
    );

    const student = await StudentRepository.getByRollNumber(roll_number);
    const student_name = student?.name || "MedTech Scholar";

    let drive_url = "#";
    let drive_file_id = "pending-drive-config";
    let drive_sync_status: "SYNCED" | "LOCAL_STAGED" = "LOCAL_STAGED";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isGoogleConfigured()) {
      try {
        const result = await uploadDocumentToDrive(
          buffer,
          generatedFilename,
          file.type,
          roll_number,
          category
        );
        drive_url = result.webViewLink;
        drive_file_id = result.fileId;
        drive_sync_status = "SYNCED";
      } catch (err) {
        drive_file_id = `pending-retry-${Date.now()}`;
        drive_url = "#";
        drive_sync_status = "LOCAL_STAGED";
      }
    } else {
      // Safe Local Staging: Do NOT upload files until Google Drive integration is configured and verified
      drive_file_id = `local-staged-${Date.now()}`;
      drive_url = "#";
      drive_sync_status = "LOCAL_STAGED";
    }

    const docRecord = await DocumentRepository.create({
      roll_number,
      student_name,
      record_id,
      category,
      original_filename: file.name,
      generated_filename: generatedFilename,
      file_type: file.type,
      file_size: file.size,
      drive_file_id,
      drive_url,
      drive_sync_status,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "DOCUMENT_UPLOADED",
      module: "Documents",
      record_id: docRecord.document_id,
      status: "SUCCESS",
      description: `Uploaded document '${generatedFilename}' (${(file.size / 1024).toFixed(0)} KB)`,
    });

    return NextResponse.json({
      success: true,
      data: docRecord,
      message: "Document uploaded successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to upload document." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID is required." }, { status: 400 });
    }

    const existing = await DocumentRepository.getById(id);
    const deleted = await DocumentRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Document record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Documents",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted document '${existing.generated_filename || existing.original_filename}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Document removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete document." }, { status: 500 });
  }
}

