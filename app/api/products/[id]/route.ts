import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/current-user";
import { priceFor } from "@/lib/pricing";

// Customer site: products are READ-ONLY.

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
    }
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ success: false, error: "Mahsulot topilmadi" }, { status: 404 });
    }
    const user = await getCurrentUser(req);
    const priceType = user?.type === "shop" ? "shop" : "individual";
    return NextResponse.json(
      { success: true, product: { ...product, unitPrice: priceFor(product, priceType), priceType } },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
