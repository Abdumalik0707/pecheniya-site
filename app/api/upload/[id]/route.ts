import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Images uploaded from the admin panel are stored in MongoDB as data URIs
// and referenced as /api/upload/<id>, so the storefront must serve them too.

const ImageSchema = new mongoose.Schema({
  data: { type: String, required: true },
  contentType: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ImageModel = mongoose.models.Image || mongoose.model("Image", ImageSchema);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const img = await ImageModel.findById(id);
    if (!img) return new NextResponse("Not found", { status: 404 });

    const base64 = img.data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": img.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
