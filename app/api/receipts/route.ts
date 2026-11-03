import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Receipt from "@/models/Receipt";
import { verifyToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

// Customer uploads a payment receipt (card transfer screenshot) before
// placing a card-paid order. The client compresses the image first, so
// anything above MAX_BYTES is rejected. Receipts are write-only here —
// they are viewed only through the admin panel.

const MAX_BYTES = 3 * 1024 * 1024;

function sniffImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`receipt:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ success: false, error: "Juda ko'p so'rov. 1 daqiqa kuting." }, { status: 429 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Fayl tanlanmadi" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: "Chek rasmi 3MB dan katta" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const type = sniffImageType(buf);
    if (!type) {
      return NextResponse.json({ success: false, error: "Faqat JPG, PNG yoki WEBP rasm" }, { status: 400 });
    }

    const auth = await verifyToken(req);
    await connectDB();
    const receipt = await Receipt.create({
      data: `data:${type};base64,${buf.toString("base64")}`,
      contentType: type,
      size: buf.length,
      userId: auth?.sub,
    });

    return NextResponse.json({ success: true, receiptId: String(receipt._id) }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
