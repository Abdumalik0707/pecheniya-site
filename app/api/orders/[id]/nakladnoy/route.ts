import { NextResponse } from "next/server";

// Nakladnoy export is available only through the admin panel.
export async function GET() {
  return NextResponse.json(
    { error: "Nakladnoy faqat admin panel orqali yuklab olinadi" },
    { status: 403 }
  );
}
