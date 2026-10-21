"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("pecheniya_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.isAdmin || user.type === "admin") {
        setAdmin(user);
        setChecking(false);
        return;
      }
    }
    router.replace("/auth/login");
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "grid", placeItems: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 16 }}>Tekshirilmoqda...</p>
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("pecheniya_user");
    router.replace("/auth/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#1e293b",
          borderRight: "1px solid #334155",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 20px", marginBottom: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            Admin Panel
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            {admin?.name}
          </div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 8px" }}>
          <Link href="/admin" style={navLinkStyle}>
            <span>📦</span> Mahsulotlar
          </Link>
          <Link href="/admin/orders" style={navLinkStyle}>
            <span>📋</span> Buyurtmalar
          </Link>
          <Link href="/" style={navLinkStyle} target="_blank">
            <span>🌐</span> Saytni ko'rish
          </Link>
        </nav>

        <div style={{ padding: "0 8px" }}>
          <button onClick={handleLogout} style={logoutBtnStyle}>
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 8,
  color: "#cbd5e1",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  transition: "background 0.15s",
};

const logoutBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  background: "transparent",
  border: "1px solid #334155",
  color: "#94a3b8",
  fontSize: 13,
  cursor: "pointer",
};
