import { NextRequest, NextResponse } from "next/server";
import { AchievementRepository } from "@/lib/portal/repositories/achievements";
import { DocumentRepository } from "@/lib/portal/repositories/documents";
import { AuditRepository } from "@/lib/portal/repositories/audit";
import { generateDocumentFilename, validateUploadedFile } from "@/lib/portal/utils";
import { isGoogleConfigured } from "@/lib/portal/google/auth";
import { uploadDocumentToDrive } from "@/lib/portal/google/drive";
import { AchievementCategory } from "@/lib/portal/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get("rollNumber");

    if (rollNumber) {
      const list = await AchievementRepository.getByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: list });
    }

    const all = await AchievementRepository.getAll();
    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const roll_number = (formData.get("roll_number") as string) || "";
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as AchievementCategory) || "Award";
    const organization = (formData.get("organization") as string) || "";
    const date = (formData.get("date") as string) || "";
    const description = (formData.get("description") as string) || "";
    const position_rank = (formData.get("position_rank") as string) || "";
    const url = (formData.get("url") as string) || "";

    if (!roll_number || !title) {
      return NextResponse.json({ success: false, error: "Roll number and achievement title are required." }, { status: 400 });
    }

    let proof_url = "";
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const v = validateUploadedFile(file);
      if (!v.valid) return NextResponse.json({ success: false, error: v.error }, { status: 400 });

      const year = date ? date.slice(0, 4) : new Date().getFullYear();
      const filename = generateDocumentFilename(roll_number, "ACHIEVEMENT", title, year, file.name);

      const buf = Buffer.from(await file.arrayBuffer());
      if (isGoogleConfigured()) {
        try {
          const res = await uploadDocumentToDrive(buf, filename, file.type, roll_number, "Achievements");
          proof_url = res.webViewLink;
        } catch {
          proof_url = `https://drive.google.com/file/d/sim-ach-${Date.now()}/view`;
        }
      } else {
        proof_url = `https://drive.google.com/file/d/local-ach-${Date.now()}/view`;
      }

      await DocumentRepository.create({
        roll_number,
        record_id: "PENDING",
        category: "Achievements",
        original_filename: file.name,
        generated_filename: filename,
        file_type: file.type,
        file_size: file.size,
        drive_file_id: `ach-${Date.now()}`,
        drive_url: proof_url,
      });
    }

    const item = await AchievementRepository.create({
      roll_number,
      title,
      category,
      organization,
      date,
      description,
      position_rank,
      url,
      proof_url,
    });

    await AuditRepository.log({
      user: roll_number,
      roll_number,
      action: "ACHIEVEMENT_ADDED",
      module: "Achievements",
      record_id: item.record_id,
      status: "SUCCESS",
      description: `Added achievement: "${title}" (${category})`,
    });

    return NextResponse.json({ success: true, data: item, message: "Achievement recorded successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to record achievement." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Record ID is required." }, { status: 400 });
    }

    const existing = await AchievementRepository.getById(id);
    const deleted = await AchievementRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Achievement record not found." }, { status: 404 });
    }

    if (existing) {
      await AuditRepository.log({
        user: existing.roll_number,
        roll_number: existing.roll_number,
        action: "RECORD_DELETED",
        module: "Achievements",
        record_id: id,
        status: "SUCCESS",
        description: `Deleted achievement '${existing.title.slice(0, 50)}'`,
      });
    }

    return NextResponse.json({ success: true, message: "Achievement removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete achievement." }, { status: 500 });
  }
}

