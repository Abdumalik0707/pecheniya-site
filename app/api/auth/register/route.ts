import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, type, shopName } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Parol kamida 6 belgi bo'lishi kerak" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ phone });
    if (existing) {
      return NextResponse.json({ error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      type: type || "individual",
      shopName: type === "shop" ? shopName : undefined,
    });

    return NextResponse.json({
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
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
