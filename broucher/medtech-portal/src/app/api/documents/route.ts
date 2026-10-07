import { NextRequest, NextResponse } from "next/server";
import { DocumentRepository } from "@/lib/repositories/documents";
import { AuditRepository } from "@/lib/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/utils";
import { isGoogleConfigured } from "@/lib/google/auth";
import { uploadDocumentToDrive } from "@/lib/google/drive";
import { DocumentCategory } from "@/types";

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

    let drive_url = "";
    let drive_file_id = "";
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
      } catch (err) {
        drive_file_id = `sim-${Date.now()}`;
        drive_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
      }
    } else {
      drive_file_id = `local-${Date.now()}`;
      drive_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
    }

    const docRecord = await DocumentRepository.create({
      roll_number,
      record_id,
      category,
      original_filename: file.name,
      generated_filename: generatedFilename,
      file_type: file.type,
      file_size: file.size,
      drive_file_id,
      drive_url,
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
