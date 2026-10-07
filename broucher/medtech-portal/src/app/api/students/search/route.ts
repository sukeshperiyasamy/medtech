import { NextRequest, NextResponse } from "next/server";
import { StudentRepository } from "@/lib/repositories/students";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      const all = await StudentRepository.getAll();
      return NextResponse.json({ success: true, data: all.slice(0, 10) });
    }

    const results = await StudentRepository.search(query);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error("Student search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search students. Please try again." },
      { status: 500 }
    );
  }
}
