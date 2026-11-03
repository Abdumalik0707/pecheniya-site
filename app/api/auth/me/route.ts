import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { getCurrentUser, publicUser } from "@/lib/current-user";
import { rateLimit } from "@/lib/rate-limit";

const unauthorized = () =>
  NextResponse.json({ success: false, error: "Avtorizatsiya talab qilinadi" }, { status: 401 });

/** Current customer's profile */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return unauthorized();
    return NextResponse.json({ success: true, user: publicUser(user) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * Update name / shop name / phone. Changing the phone number (the login)
 * requires the current password.
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return unauthorized();

    const rl = rateLimit(`profile:${user._id}`, { limit: 10, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ success: false, error: "Juda ko'p urinish. 1 daqiqa kuting." }, { status: 429 });
    }

    const body = await req.json();
    const update: Record<string, string> = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (name.length < 2 || name.length > 100) {
        return NextResponse.json({ success: false, error: "Ism 2-100 belgi bo'lishi kerak" }, { status: 400 });
      }
      update.name = name;
    }

    if (body.shopName !== undefined && user.type === "shop") {
      update.shopName = String(body.shopName).trim().slice(0, 200);
    }

    if (body.phone !== undefined) {
      const phone = String(body.phone).replace(/\s/g, "");
      if (!/^\+998\d{9}$/.test(phone)) {
        return NextResponse.json(
          { success: false, error: "Telefon raqam +998XXXXXXXXX formatda bo'lishi kerak" },
          { status: 400 }
        );
      }
      if (phone !== user.phone) {
        const full = await User.findById(user._id).select("password");
        const ok = full && (await bcrypt.compare(String(body.currentPassword || ""), full.password));
        if (!ok) {
          return NextResponse.json(
            { success: false, error: "Telefonni o'zgartirish uchun joriy parolni to'g'ri kiriting" },
            { status: 400 }
          );
        }
        const taken = await User.exists({ phone, _id: { $ne: user._id } });
        if (taken) {
          return NextResponse.json(
            { success: false, error: "Bu telefon raqam boshqa akkauntga biriktirilgan" },
            { status: 409 }
          );
        }
        update.phone = phone;
      }
    }

    if (Object.keys(update).length > 0) {
      await User.updateOne({ _id: user._id }, update);
    }
    const fresh = await getCurrentUser(req);
    return NextResponse.json({ success: true, user: fresh ? publicUser(fresh) : null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Xatolik";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
