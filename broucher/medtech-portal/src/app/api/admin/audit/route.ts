import { NextResponse } from "next/server";
import { AuditRepository } from "@/lib/repositories/audit";

export async function GET() {
  try {
    const logs = await AuditRepository.getAll();
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
