import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.headers.set("Set-Cookie", clearUserCookie());
  return res;
}
