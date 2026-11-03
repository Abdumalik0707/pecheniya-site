import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, userCookieHeader } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Juda ko'p urinish. 1 daqiqa kuting." },
        { status: 429 }
      );
    }

    const { name, phone, password, type, shopName } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (String(name).trim().length < 2 || String(name).trim().length > 100) {
      return NextResponse.json({ error: "Ism 2-100 belgi bo'lishi kerak" }, { status: 400 });
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "Parol kamida 6 belgi bo'lishi kerak" },
        { status: 400 }
      );
    }
    // Phone format: must start with +998
    const cleanPhone = String(phone).replace(/\s/g, "");
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Telefon raqam +998XXXXXXXXX formatda bo'lishi kerak" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ phone });
    if (existing) {
      return NextResponse.json(
        { error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: String(name).trim().slice(0, 100),
      phone: cleanPhone,
      password: hashed,
      type: type === "shop" ? "shop" : "individual",
      shopName: type === "shop" ? String(shopName || "").trim().slice(0, 200) : undefined,
    });

    const token = await signToken(String(user._id));
    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        type: user.type,
        shopName: user.shopName,
        isAdmin: user.isAdmin,
      },
    });
    res.headers.set("Set-Cookie", userCookieHeader(token));
    return res;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
