import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

/*  ─── JWT-based customer auth ───────────────────────────────────────
 *  On login/register the server sets an httpOnly cookie with a JWT.
 *  Protected routes call requireUser() to verify.
 */

const ALG = "HS256";
const TOKEN_NAME = "smag_user_token";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
    console.warn("[security] JWT_SECRET is not set — sessions are signed with a key derived from MONGODB_URI. Set JWT_SECRET.");
  }
  const raw = process.env.JWT_SECRET || process.env.MONGODB_URI || "";
  return new TextEncoder().encode(raw.slice(0, 64));
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyToken(
  req: NextRequest
): Promise<{ sub: string } | null> {
  const cookie = req.cookies.get(TOKEN_NAME);
  if (!cookie?.value) return null;
  try {
    const { payload } = await jwtVerify(cookie.value, getSecret(), {
      algorithms: [ALG],
    });
    if (!payload.sub) return null;
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}

export async function requireUser(
  req: NextRequest
): Promise<NextResponse | null> {
  const auth = await verifyToken(req);
  if (!auth) {
    return NextResponse.json(
      { success: false, error: "Avtorizatsiya talab qilinadi" },
      { status: 401 }
    );
  }
  return null;
}

export function userCookieHeader(token: string): string {
  const parts = [
    `${TOKEN_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${MAX_AGE}`,
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function clearUserCookie(): string {
  return `${TOKEN_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
