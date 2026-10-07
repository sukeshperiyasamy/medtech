import { NextRequest, NextResponse } from "next/server";
import { SubmissionRepository } from "@/lib/portal/repositories/submissions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    let submissions = await SubmissionRepository.getAll();

    if (status) {
      submissions = submissions.filter((s) => s.status === status);
    }
    if (type) {
      submissions = submissions.filter((s) => s.submission_type === type);
    }

    return NextResponse.json({
      success: true,
      data: submissions,
      total: submissions.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studentData = body.payload
      ? { ...body.payload, roll_number: body.roll_number || body.payload.roll_number }
      : body;

    if (!studentData.roll_number) {
      return NextResponse.json(
        { success: false, error: "Roll number is required for submission." },
        { status: 400 }
      );
    }

    const submission = await SubmissionRepository.submit(
      studentData,
      request.headers.get("x-submitter") || "Google Form Sync"
    );

    return NextResponse.json({
      success: true,
      data: submission,
      message: `Submission registered as ${submission.submission_type}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process submission." },
      { status: 500 }
    );
  }
}
