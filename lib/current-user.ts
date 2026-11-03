import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export interface CurrentUser {
  _id: string;
  name: string;
  phone: string;
  type: "individual" | "shop" | "admin";
  shopName?: string;
  createdAt?: Date;
}

/** The logged-in customer (from the JWT cookie), or null. Never includes the password hash. */
export async function getCurrentUser(req: NextRequest): Promise<CurrentUser | null> {
  const auth = await verifyToken(req);
  if (!auth || !/^[0-9a-fA-F]{24}$/.test(auth.sub)) return null;
  await connectDB();
  const user = await User.findById(auth.sub).select("name phone type shopName createdAt").lean();
  if (!user) return null;
  return {
    _id: String(user._id),
    name: user.name,
    phone: user.phone,
    type: user.type,
    shopName: user.shopName,
    createdAt: user.createdAt,
  };
}

/**
 * Mongo filter for "this customer's orders". New orders carry userId; orders
 * placed before userId existed are matched by the account's phone number.
 */
export function ownOrdersFilter(user: CurrentUser) {
  return {
    $or: [
      { userId: user._id },
      { userId: { $exists: false }, customerPhone: user.phone },
    ],
  };
}

export function publicUser(user: CurrentUser) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    type: user.type,
    shopName: user.shopName,
    createdAt: user.createdAt,
  };
}
