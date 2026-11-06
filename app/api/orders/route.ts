import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Receipt from "@/models/Receipt";
import { priceFor } from "@/lib/pricing";
import { getCurrentUser, ownOrdersFilter } from "@/lib/current-user";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    // Customers see only their own orders
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }
    await dbConnect();
    const orders = await Order.find(ownOrdersFilter(user))
      .select("products totalAmount status paymentMethod receiptId customerAddress customerType createdAt updatedAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limit order creation
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`order:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: "Juda ko'p so'rov. 1 daqiqa kuting." },
      { status: 429 }
    );
  }

  try {
    await dbConnect();
    const body = await req.json();

    // Validate required fields
    if (!body.customerName || !body.customerPhone || !body.customerAddress) {
      return NextResponse.json(
        { success: false, error: "Ism, telefon va manzil majburiy" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Kamida bitta mahsulot tanlang" },
        { status: 400 }
      );
    }

    if (body.products.length > 50) {
      return NextResponse.json(
        { success: false, error: "Bitta buyurtmada 50 dan ortiq mahsulot bo'lishi mumkin emas" },
        { status: 400 }
      );
    }

    // Payment: cash, or card transfer with an uploaded receipt
    const paymentMethod = body.paymentMethod === "card" ? "card" : body.paymentMethod === "cash" ? "cash" : null;
    if (!paymentMethod) {
      return NextResponse.json({ success: false, error: "To'lov turini tanlang" }, { status: 400 });
    }
    const receiptId = typeof body.receiptId === "string" ? body.receiptId : "";
    if (paymentMethod === "card") {
      if (!/^[0-9a-fA-F]{24}$/.test(receiptId)) {
        return NextResponse.json({ success: false, error: "Karta orqali to'lov uchun chekni yuklang" }, { status: 400 });
      }
      const receipt = await Receipt.findById(receiptId).select("_id orderId").lean();
      if (!receipt || receipt.orderId) {
        return NextResponse.json({ success: false, error: "Chek topilmadi, qayta yuklang" }, { status: 400 });
      }
    }

    // Customer type decides the price list. A logged-in customer's type comes
    // from their account, never from the request body.
    const account = await getCurrentUser(req);
    if (!account) {
      return NextResponse.json(
        { success: false, error: "Buyurtma berish uchun tizimga kiring" },
        { status: 401 }
      );
    }
    const customerType: "individual" | "shop" = account.type === "shop" ? "shop" : "individual";
    const auth = { sub: account._id };

    // SERVER-SIDE PRICE VALIDATION: fetch real prices from DB
    const productIds = body.products
      .map((p: { productId: string }) => p.productId)
      .filter((id: string) => /^[0-9a-fA-F]{24}$/.test(id));

    const dbProducts = await Product.find({ _id: { $in: productIds } })
      .select("_id name price shopPrice")
      .lean();
    const priceMap = new Map(
      (dbProducts as { _id: unknown; name: string; price: number; shopPrice?: number }[]).map((p) => [
        String(p._id),
        p,
      ])
    );

    let serverTotal = 0;
    const validatedProducts = [];

    for (const item of body.products) {
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (qty > 10000) {
        return NextResponse.json(
          { success: false, error: `Miqdor juda katta: ${qty}` },
          { status: 400 }
        );
      }

      // Use server price, NOT client price
      const dbProd = priceMap.get(item.productId);
      const realPrice = dbProd ? priceFor(dbProd, customerType) : Number(item.price) || 0;

      if (realPrice <= 0) {
        return NextResponse.json(
          { success: false, error: `Noto'g'ri narx: ${item.productName}` },
          { status: 400 }
        );
      }

      validatedProducts.push({
        productId: String(item.productId).slice(0, 100),
        productName: String(item.productName || dbProd?.name || "").slice(0, 200),
        quantity: qty,
        price: realPrice,
      });
      serverTotal += qty * realPrice;
    }

    const order = await Order.create({
      userId: auth && /^[0-9a-fA-F]{24}$/.test(auth.sub) ? auth.sub : undefined,
      customerName: String(body.customerName).trim().slice(0, 200),
      customerPhone: String(body.customerPhone).trim().slice(0, 30),
      customerAddress: String(body.customerAddress).trim().slice(0, 500),
      customerLat: Number(body.customerLat) || undefined,
      customerLng: Number(body.customerLng) || undefined,
      customerType,
      products: validatedProducts,
      totalAmount: serverTotal,
      status: "yangi_mijoz",
      paymentMethod,
      receiptId: paymentMethod === "card" ? receiptId : undefined,
      notes: body.notes ? String(body.notes).slice(0, 2000) : undefined,
    });

    if (paymentMethod === "card") {
      await Receipt.updateOne({ _id: receiptId }, { orderId: String(order._id) });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
