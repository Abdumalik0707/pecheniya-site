import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, userCookieHeader } from "@/lib/auth";
import { phoneVariants } from "@/lib/phone";
import { hit, peek, clear, clientIp } from "@/lib/rate-limit-db";

const MINUTE = 60_000;
const MAX_FAILS_PER_ACCOUNT = 5; // then locked for 15 minutes
const MAX_ATTEMPTS_PER_IP = 30; // per 10 minutes

// Compared against when the phone isn't registered, so a wrong phone and a
// wrong password take the same time and give the same answer.
const DUMMY_HASH = "$2b$12$Ba9p2v9ey7zg6Ra8f0STm.WYNBeF17nAdsMRmMQEFhxAnqEUu10TK";
const BAD_CREDENTIALS = "Telefon raqam yoki parol noto'g'ri";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if ((await hit(`login-ip:${ip}`, 10 * MINUTE)) > MAX_ATTEMPTS_PER_IP) {
      return NextResponse.json({ error: "Juda ko'p urinish. Birozdan keyin qayta urining." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    // only plain strings — objects like {"$ne": ""} would become Mongo operators
    if (!body || typeof body.phone !== "string" || typeof body.password !== "string" || !body.password) {
      return NextResponse.json({ error: "Telefon raqam va parolni kiriting" }, { status: 400 });
    }
    if (body.password.length > 128) {
      return NextResponse.json({ error: BAD_CREDENTIALS }, { status: 401 });
    }

    const variants = phoneVariants(body.phone);
    const acctKey = `login-acct:${variants[0]}`;
    if ((await peek(acctKey)) >= MAX_FAILS_PER_ACCOUNT) {
      return NextResponse.json(
        { error: "Juda ko'p noto'g'ri urinish. 15 daqiqadan keyin qayta urining." },
        { status: 429 }
      );
    }

    await connectDB();
    // old accounts were saved as "+998 90…", new ones as "+99890…" — match both
    const candidates = await User.find({ phone: { $in: variants } });

    let user = null;
    for (const c of candidates) {
      if (await bcrypt.compare(body.password, c.password)) { user = c; break; }
    }
    if (candidates.length === 0) await bcrypt.compare(body.password, DUMMY_HASH);

    // administrators sign in through the admin panel only
    if (!user || user.isAdmin || user.type === "admin") {
      await hit(acctKey, 15 * MINUTE);
      return NextResponse.json({ error: BAD_CREDENTIALS }, { status: 401 });
    }

    await clear(acctKey);
    const token = await signToken(String(user._id));
    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        type: user.type,
        shopName: user.shopName,
      },
    });
    res.headers.set("Set-Cookie", userCookieHeader(token));
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
