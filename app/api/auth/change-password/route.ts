import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/current-user";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Avtorizatsiya talab qilinadi" }, { status: 401 });
    }

    const rl = rateLimit(`chpass:${user._id}`, { limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ success: false, error: "Juda ko'p urinish. 1 daqiqa kuting." }, { status: 429 });
    }

    const { currentPassword, newPassword } = await req.json();
    const next = String(newPassword || "");
    if (next.length < 6 || next.length > 128) {
      return NextResponse.json({ success: false, error: "Yangi parol kamida 6 belgi bo'lishi kerak" }, { status: 400 });
    }

    const full = await User.findById(user._id).select("password");
    if (!full || !(await bcrypt.compare(String(currentPassword || ""), full.password))) {
      return NextResponse.json({ success: false, error: "Joriy parol noto'g'ri" }, { status: 400 });
    }
    if (await bcrypt.compare(next, full.password)) {
      return NextResponse.json({ success: false, error: "Yangi parol eskisidan farq qilishi kerak" }, { status: 400 });
    }

    full.password = await bcrypt.hash(next, 12);
    await full.save();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
