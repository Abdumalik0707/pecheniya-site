"use client";

import { useEffect, useState } from "react";

export interface Customer {
  name: string;
  phone: string;
  type: string;
  shopName?: string;
}

const KEY = "pecheniya_user";

function readStored(): Customer | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Customer) : null;
  } catch {
    return null;
  }
}

// Several components on one page ask at once — share a single request.
let inflight: Promise<Customer | null | undefined> | null = null;

/**
 * Asks the server who is logged in (session cookie) and refreshes the
 * localStorage copy. Returns undefined when the server can't be reached,
 * so callers keep whatever they had.
 */
function syncWithServer(): Promise<Customer | null | undefined> {
  if (!inflight) {
    inflight = fetch("/api/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem(KEY); // session expired — not logged in any more
          return null;
        }
        const data = await res.json();
        if (!data.success) return undefined;
        localStorage.setItem(KEY, JSON.stringify(data.user));
        return data.user as Customer;
      })
      .catch(() => undefined)
      .finally(() => setTimeout(() => { inflight = null; }, 1500));
  }
  return inflight;
}

/**
 * The logged-in customer. The localStorage copy is shown immediately, then
 * replaced by what the server says — the account type (shop / individual)
 * decides which price list is shown, so it must never be stale.
 */
export function useCustomer() {
  const [user, setUser] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setUser(readStored());
    syncWithServer().then((fresh) => {
      if (cancelled) return;
      if (fresh !== undefined) setUser(fresh);
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  return { user, ready };
}
