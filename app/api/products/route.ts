import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/current-user";
import { priceFor } from "@/lib/pricing";

// Customer site: products are READ-ONLY.
// Creation/editing/deletion happens through the admin panel.

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Shop accounts see the shop price list, everybody else the regular one.
    const user = await getCurrentUser(req);
    const priceType = user?.type === "shop" ? "shop" : "individual";
    const rows = await Product.find({}).sort({ createdAt: -1 }).lean();
    const products = rows.map((p) => ({ ...p, unitPrice: priceFor(p, priceType), priceType }));
    return NextResponse.json(
      { success: true, products, priceType },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
