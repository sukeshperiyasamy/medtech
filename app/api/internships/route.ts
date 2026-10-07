import { NextRequest, NextResponse } from "next/server";
import { InternshipRepository } from "@/lib/portal/repositories/internships";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { InternshipType, InternshipStatus } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await InternshipRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await InternshipRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch internships" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const organization = (formData.get("organization") as string) || "";
    const role = (formData.get("role") as string) || "";
    const internship_type = (formData.get("internship_type") as InternshipType) || "Industrial";
    const start_date = (formData.get("start_date") as string) || "";
    const end_date = (formData.get("end_date") as string) || "";
    const description = (formData.get("description") as string) || "";
    const technologies = (formData.get("technologies") as string) || "";
    const supervisor = (formData.get("supervisor") as string) || "";
    const location = (formData.get("location") as string) || "";
    const status = (formData.get("status") as InternshipStatus) || "Completed";
    const force = formData.get("force") === "true";

    if (!roll_number || !organization) {
      return NextResponse.json(
        { success: false, error: "Roll number and organization name are required." },
        { status: 400 }
      );
    }

    // 1. Duplicate Check: Roll Number + Org + Start Date
    if (!force) {
      const dupCheck = await InternshipRepository.checkDuplicate(roll_number, organization, start_date);
      if (dupCheck.isDuplicate && dupCheck.existingRecord) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            warning: `An internship at ${organization} starting ${start_date || "N/A"} already exists in your records.`,
            existingRecord: dupCheck.existingRecord,
          },
          { status: 409 }
        );
      }
    }

    // 2. Upload Certificate if present
    let certificate_url = "";
    const certFile = formData.get("certificate_file") as File | null;
    if (certFile && certFile.size > 0) {
      const v = validateUploadedFile(certFile);
      if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });

      const year = start_date ? start_date.slice(0, 4) : new Date().getFullYear();
      const filename = `${roll_number.toUpperCase()}_INTERNSHIP_${organization.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}_${year}_CERTIFICATE.${certFile.name.split(".").pop() || "pdf"}`;

      const buf = Buffer.from(await certFile.arrayBuffer());
      if (isGoogleConfigured()) {
        try {
          const res = await uploadDocumentToDrive(buf, filename, certFile.type, roll_number, "Internships");
          certificate_url = res.webViewLink;
        } catch {
          certificate_url = `https://drive.google.com/file/d/sim-cert-${Date.now()}/view`;
        }
      } else {
        certificate_url = `https://drive.google.com/file/d/local-cert-${Date.now()}/view`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Internships",
        original_filename: certFile.name,
        generated_filename: filename,
        file_type: certFile.type,
        file_size: certFile.size,
        drive_file_id: `cert-${Date.now()}`,
        drive_url: certificate_url,
      });
    }

    // 3. Upload Offer Letter if present
    let offer_letter_url = "";
    const offerFile = formData.get("offer_file") as File | null;
    if (offerFile && offerFile.size > 0) {
      const v = validateUploadedFile(offerFile);
      if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });

      const year = start_date ? start_date.slice(0, 4) : new Date().getFullYear();
      const filename = `${roll_number.toUpperCase()}_INTERNSHIP_${organization.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}_${year}_OFFER.${offerFile.name.split(".").pop() || "pdf"}`;

      const buf = Buffer.from(await offerFile.arrayBuffer());
      if (isGoogleConfigured()) {
        try {
          const res = await uploadDocumentToDrive(buf, filename, offerFile.type, roll_number, "Internships");
          offer_letter_url = res.webViewLink;
        } catch {
          offer_letter_url = `https://drive.google.com/file/d/sim-offer-${Date.now()}/view`;
        }
      } else {
        offer_letter_url = `https://drive.google.com/file/d/local-offer-${Date.now()}/view`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Internships",
        original_filename: offerFile.name,
        generated_filename: filename,
        file_type: offerFile.type,
        file_size: offerFile.size,
        drive_file_id: `offer-${Date.now()}`,
        drive_url: offer_letter_url,
      });
    }

    const newInternship = await InternshipRepository.create({
      roll_number,
      organization,
      role,
      internship_type,
      start_date,
      end_date,
      description,
      technologies,
      supervisor,
      location,
      status,
      certificate_url,
      offer_letter_url,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "INTERNSHIP_ADDED",
      module: "Internships",
      record_id: newInternship.record_id,
      status: "SUCCESS",
      description: `Added internship at ${organization} (${role})`,
    });

    return NextResponse.json({
      success: true,
      data: newInternship,
      message: "Internship record added successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to add internship." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required." }, { status: 400 });
    }

    const existing = await InternshipRepository.getById(id);
    const deleted = await InternshipRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Internship record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Internships",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted internship at '${existing.organization}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Internship removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete internship." }, { status: 500 });
  }
}

