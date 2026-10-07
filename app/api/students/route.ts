import { NextRequest, NextResponse } from "next/server";
import { StudentRepository } from "@/lib/portal/repositories/students";
import { AuditRepository } from "@/lib/portal/repositories/audit";

export async function GET() {
  try {
    const students = await StudentRepository.getAll();
    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.roll_number || !body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Roll Number, Name, and Institutional Email are required." },
        { status: 400 }
      );
    }

    const existing = await StudentRepository.getByRollNumber(body.roll_number);
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Student with roll number ${body.roll_number} already exists.` },
        { status: 409 }
      );
    }

    const created = await StudentRepository.create(body);

    await AuditRepository.log({
      user: "admin",
      roll_number: body.roll_number,
      action: "STUDENT_CREATED",
      module: "Students",
      record_id: body.roll_number,
      status: "SUCCESS",
      description: `Registered student ${body.name} (${body.roll_number})`,
    });

    return NextResponse.json({ success: true, data: created, message: "Student registered successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to register student." }, { status: 500 });
  }
}
