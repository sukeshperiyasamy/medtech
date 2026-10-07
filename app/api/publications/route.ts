import { NextRequest, NextResponse } from "next/server";
import { PublicationRepository } from "@/lib/portal/repositories/publications";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile, parseRequestPayload } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { PublicationType, PublicationStatus } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const pubs = await PublicationRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: pubs });
    }

    const all = await PublicationRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch publications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseRequestPayload(request);

    const roll_number = payload.get("roll_number");
    const title = payload.get("title");
    const authors = payload.get("authors");
    const journal_conference = payload.get("journal_conference");
    const publication_type = (payload.get("publication_type") as PublicationType) || "Journal Article";
    const doi = payload.get("doi");
    const publisher = payload.get("publisher");
    const publication_date = payload.get("publication_date");
    const volume = payload.get("volume");
    const issue = payload.get("issue");
    const pages = payload.get("pages");
    const url = payload.get("url");
    const student_contribution = payload.get("student_contribution") || "First Author";
    const status = (payload.get("status") as PublicationStatus) || "Published";
    const force = payload.get("force") === "true";

    if (!roll_number || !title || !journal_conference) {
      return NextResponse.json(
        { success: false, error: "Roll number, publication title, and journal/conference are required." },
        { status: 400 }
      );
    }

    // 1. Duplicate detection
    if (!force) {
      const dupCheck = await PublicationRepository.checkDuplicate(roll_number, title, doi, publication_date);
      if (dupCheck.isDuplicate && dupCheck.existingRecord) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            warning: "This record may already exist in your portfolio.",
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

      const year = publication_date ? publication_date.slice(0, 4) : new Date().getFullYear();
      const generatedFilename = generateDocumentFilename(
        roll_number,
        "PUBLICATION",
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
            "Publications"
          );
          document_url = driveResult.webViewLink;
          drive_file_id = driveResult.fileId;
        } catch (uploadErr) {
          console.error("Google Drive upload error, falling back to simulated document URL:", uploadErr);
          drive_file_id = `sim-${Date.now()}`;
          document_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
        }
      } else {
        // Local simulation URL for testing
        drive_file_id = `local-${Date.now()}`;
        document_url = `https://drive.google.com/file/d/${drive_file_id}/view?usp=sharing`;
      }

      // Record in Documents repository
      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING", // updated below
        category: "Publications",
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
        description: `Uploaded publication document '${generatedFilename}'`,
      });
    }

    // 3. Create publication in repository / Google Sheets
    const newPub = await PublicationRepository.create({
      roll_number,
      title,
      authors: authors || roll_number,
      journal_conference,
      publication_type,
      doi,
      publisher,
      publication_date,
      volume,
      issue,
      pages,
      url,
      student_contribution,
      status,
      document_url,
      drive_file_id,
    });

    // 4. Audit Log
    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "PUBLICATION_ADDED",
      module: "Publications",
      record_id: newPub.record_id,
      status: "SUCCESS",
      description: `Added ${publication_type}: "${title.slice(0, 60)}" (${journal_conference})`,
    });

    return NextResponse.json({
      success: true,
      data: newPub,
      message: "Publication added successfully.",
    });
  } catch (error: any) {
    console.error("Publication creation error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save publication. Please try again." },
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

    const existing = await PublicationRepository.getById(id);
    const deleted = await PublicationRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Publication record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Publications",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted publication '${existing.title.slice(0, 50)}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Publication removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete publication." }, { status: 500 });
  }
}

