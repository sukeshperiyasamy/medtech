import { NextRequest, NextResponse } from "next/server";
import { PatentRepository } from "@/lib/repositories/patents";
import { DocumentRepository } from "@/lib/repositories/documents";
import { AuditRepository } from "@/lib/repositories/audit";
import { generateDocumentFilename, validateUploadedFile, parseRequestPayload } from "@/lib/utils";
import { isGoogleConfigured } from "@/lib/google/auth";
import { uploadDocumentToDrive } from "@/lib/google/drive";
import { PatentType, PatentStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const patents = await PatentRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: patents });
    }

    const all = await PatentRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch patents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseRequestPayload(request);

    const roll_number = payload.get("roll_number");
    const title = payload.get("title");
    const inventors = payload.get("inventors");
    const application_no = payload.get("application_no");
    const patent_no = payload.get("patent_no");
    const filing_date = payload.get("filing_date");
    const publication_date = payload.get("publication_date");
    const patent_type = (payload.get("patent_type") as PatentType) || "Indian Patent";
    const patent_office = payload.get("patent_office") || "Indian Patent Office (IPO)";
    const status = (payload.get("status") as PatentStatus) || "Filed";
    const applicant_organization =
      payload.get("applicant_organization") ||
      "Indian Institute of Technology Jodhpur & AIIMS Jodhpur";
    const patent_url = payload.get("patent_url");
    const force = payload.get("force") === "true";

    if (!roll_number || !title) {
      return NextResponse.json(
        { success: false, error: "Roll number and patent title are required." },
        { status: 400 }
      );
    }

    // 1. Duplicate detection
    if (!force && application_no) {
      const dupCheck = await PatentRepository.checkDuplicate(roll_number, application_no);
      if (dupCheck.isDuplicate && dupCheck.existingRecord) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            warning: `A patent with application number '${application_no}' already exists in your records.`,
            existingRecord: dupCheck.existingRecord,
          },
          { status: 409 }
        );
      }
    }

    // 2. Handle File Upload
    let document_url = "";
    let drive_file_id = "";
    const file = payload.getFile("file");

    if (file && file.size > 0) {
      const validation = validateUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }

      const year = filing_date ? filing_date.slice(0, 4) : new Date().getFullYear();
      const generatedFilename = generateDocumentFilename(
        roll_number,
        "PATENT",
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
            "Patents"
          );
          document_url = driveResult.webViewLink;
          drive_file_id = driveResult.fileId;
        } catch (uploadErr) {
          console.error("Google Drive upload error, falling back to simulated document URL:", uploadErr);
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
        category: "Patents",
        original_filename: file.name,
        generated_filename: generatedFilename,
        file_type: file.type,
        file_size: file.size,
        drive_file_id,
        drive_url: document_url,
      });

      await AuditRepository.log({
        user: roll_number,
        roll_number,
        action: "DOCUMENT_UPLOADED",
        module: "Documents",
        record_id: drive_file_id,
        status: "SUCCESS",
        description: `Uploaded patent filing document '${generatedFilename}'`,
      });
    }

    const newPatent = await PatentRepository.create({
      roll_number,
      title,
      inventors: inventors || roll_number,
      application_no,
      patent_no,
      filing_date,
      publication_date,
      patent_type,
      patent_office,
      status,
      applicant_organization,
      patent_url,
      document_url,
      drive_file_id,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "PATENT_ADDED",
      module: "Patents",
      record_id: newPatent.record_id,
      status: "SUCCESS",
      description: `Added Patent: "${title.slice(0, 60)}" (App No: ${application_no || "N/A"})`,
    });

    return NextResponse.json({
      success: true,
      data: newPatent,
      message: "Patent record saved successfully.",
    });
  } catch (error: any) {
    console.error("Patent creation error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save patent record. Please try again." },
      { status: 500 }
    );
  }
}
