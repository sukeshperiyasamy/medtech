import { NextRequest, NextResponse } from "next/server";
import { SubmissionRepository } from "@/lib/portal/repositories/submissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await SubmissionRepository.getById(id);
    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch submission." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action;
    const reviewer = body.reviewer || "Admin Desk";

    if (!action) {
      return NextResponse.json(
        { success: false, error: "Action is required (APPROVE, REJECT, REQUEST_CORRECTION, MERGE_DUPLICATE)" },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      const result = await SubmissionRepository.approve(id, reviewer);
      return NextResponse.json({
        success: true,
        message: "Submission approved and student profile updated.",
        data: result.student,
      });
    }

    if (action === "REJECT") {
      const reason = body.reason || "Submission rejected by administration.";
      const ok = await SubmissionRepository.reject(id, reviewer, reason);
      return NextResponse.json({
        success: ok,
        message: "Submission rejected.",
      });
    }

    if (action === "REQUEST_CORRECTION") {
      const notes = body.notes || "Correction requested for submitted details.";
      const ok = await SubmissionRepository.requestCorrection(id, reviewer, notes);
      return NextResponse.json({
        success: ok,
        message: "Correction requested from student.",
      });
    }

    if (action === "MERGE_DUPLICATE") {
      const ok = await SubmissionRepository.mergeDuplicate(id, reviewer);
      return NextResponse.json({
        success: ok,
        message: "Duplicate fields merged safely into existing record.",
      });
    }

    return NextResponse.json(
      { success: false, error: `Unsupported action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process administrative action." },
      { status: 500 }
    );
  }
}
