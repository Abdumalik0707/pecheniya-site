import { NextResponse } from "next/server";

// Image uploads go through the admin panel (/api/upload there),
// which compresses with sharp and stores in MongoDB.
// This endpoint on the customer site is intentionally disabled.

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Rasm yuklash faqat admin panel orqali" },
    { status: 403 }
  );
}
