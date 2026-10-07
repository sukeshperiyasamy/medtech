import { NextRequest, NextResponse } from "next/server";
import { ConferenceRepository } from "@/lib/repositories/conferences";
import { DocumentRepository } from "@/lib/repositories/documents";
import { AuditRepository } from "@/lib/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/utils";
import { isGoogleConfigured } from "@/lib/google/auth";
import { uploadDocumentToDrive } from "@/lib/google/drive";
import { ConferenceType, ParticipationType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await ConferenceRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await ConferenceRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch conferences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const conference_name = (formData.get("conference_name") as string) || "";
    const conference_type = (formData.get("conference_type") as ConferenceType) || "International";
    const location = (formData.get("location") as string) || "";
    const date = (formData.get("date") as string) || "";
    const participation_type = (formData.get("participation_type") as ParticipationType) || "Oral Presentation";
    const paper_presented = (formData.get("paper_presented") as string) || "Yes";
    const presentation_title = (formData.get("presentation_title") as string) || "";
    const organizer = (formData.get("organizer") as string) || "";
    const url = (formData.get("url") as string) || "";

    if (!roll_number || !conference_name) {
      return NextResponse.json({ success: false, error: "Roll number and conference name are required." }, { status: 400 });
    }

    let certificate_url = "";
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const v = validateUploadedFile(file);
      if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });

      const year = date ? date.slice(0, 4) : new Date().getFullYear();
      const filename = generateDocumentFilename(roll_number, "CONFERENCE", conference_name, year, file.name);

      const buf = Buffer.from(await file.arrayBuffer());
      if (isGoogleConfigured()) {
        try {
          const res = await uploadDocumentToDrive(buf, filename, file.type, roll_number, "Conferences");
          certificate_url = res.webViewLink;
        } catch {
          certificate_url = `https://drive.google.com/file/d/sim-cnf-${Date.now()}/view`;
        }
      } else {
        certificate_url = `https://drive.google.com/file/d/local-cnf-${Date.now()}/view`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Conferences",
        original_filename: file.name,
        generated_filename: filename,
        file_type: file.type,
        file_size: file.size,
        drive_file_id: `cnf-${Date.now()}`,
        drive_url: certificate_url,
      });
    }

    const item = await ConferenceRepository.create({
      roll_number,
      conference_name,
      conference_type,
      location,
      date,
      participation_type,
      paper_presented,
      presentation_title,
      organizer,
      url,
      certificate_url,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "CONFERENCE_ADDED",
      module: "Conferences",
      record_id: item.record_id,
      status: "SUCCESS",
      description: `Added conference participation: "${conference_name}"`,
    });

    return NextResponse.json({ success: true, data: item, message: "Conference participation added successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to add conference." }, { status: 500 });
  }
}
