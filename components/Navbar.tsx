"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OPERATOR } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PhoneIcon } from "./Icons";

interface StoredUser {
  name: string;
  phone: string;
  isAdmin?: boolean;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("pecheniya_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  function handleLogout() {
    localStorage.removeItem("pecheniya_user");
    setUser(null);
    setDropOpen(false);
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          padding: "0 16px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smag-logo.png" alt="SmaG" style={{ height: 40, width: "auto" }} />
          <span
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: 17,
              fontWeight: 900,
              color: "var(--fg)",
              letterSpacing: "-0.3px",
            }}
            className="nav-brand-text"
          >
            PECHENIYA
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="nav-desktop-only">
          <Link href="/#mahsulotlar" style={{ color: "var(--muted)", fontSize: 14.5, fontWeight: 500, textDecoration: "none" }}>
            {t("nav_products")}
          </Link>
          <Link href="/#qanday" style={{ color: "var(--muted)", fontSize: 14.5, fontWeight: 500, textDecoration: "none" }}>
            {t("nav_how")}
          </Link>
          <a
            href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--accent)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <PhoneIcon size={14} color="var(--accent)" /> {OPERATOR.phone}
          </a>
        </div>

        {/* Right (desktop) */}
        <div className="nav-desktop-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageSwitcher />

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                cursor: "pointer",
                fontSize: 16,
                display: "grid",
                placeItems: "center",
                color: "var(--fg)",
              }}
              aria-label="Temani almashtirish"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          )}

          {mounted && (
            user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    cursor: "pointer",
                    color: "var(--fg)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 13,
                    fontWeight: 800,
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                  <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
                </button>

                {dropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 16,
                      boxShadow: "var(--shadow)",
                      minWidth: 180,
                      padding: "8px",
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>{user.phone}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--red, #ef4444)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {t("nav_logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--muted)",
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                  }}
                >
                  {t("nav_login")}
                </Link>

                <Link
                  href="/auth/register"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    background: "var(--accent)",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "9px 20px",
                    borderRadius: 20,
                  }}
                >
                  {t("nav_register")}
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile: hamburger only */}
        <button
          className="nav-mobile-only"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menyu"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            fontSize: 18,
            lineHeight: 1,
            color: "var(--fg)",
            cursor: "pointer",
            placeItems: "center",
            padding: 0,
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div
          className="nav-mobile-only"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <Link href="/#mahsulotlar" onClick={() => setMobileOpen(false)} style={{ color: "var(--fg)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            {t("nav_products")}
          </Link>
          <Link href="/#qanday" onClick={() => setMobileOpen(false)} style={{ color: "var(--fg)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            {t("nav_how")}
          </Link>
          <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`} style={{ color: "var(--accent)", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <PhoneIcon size={15} color="var(--accent)" /> {OPERATOR.phone}
          </a>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <LanguageSwitcher />
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border)",
                  background: "var(--surface-2)", cursor: "pointer", fontSize: 16,
                  display: "grid", placeItems: "center", color: "var(--fg)",
                }}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            )}
          </div>

          {mounted && (
            user ? (
              <>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{user.name} · {user.phone}</div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "12px", borderRadius: 14, background: "var(--surface-2)",
                    border: "1px solid var(--border)", color: "var(--red, #ef4444)",
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {t("nav_logout")}
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--fg)",
                    textDecoration: "none", padding: "12px", borderRadius: 14, border: "1px solid var(--border)",
                  }}
                >
                  {t("nav_login")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, background: "var(--accent)",
                    color: "#fff", textDecoration: "none", padding: "12px", borderRadius: 14,
                  }}
                >
                  {t("nav_register")}
                </Link>
              </div>
            )
          )}
        </div>
      )}

      <style>{`
        .nav-mobile-only { display: none !important; }
        @media (max-width: 860px) {
          .nav-desktop-only { display: none !important; }
          .nav-desktop-right { display: none !important; }
          .nav-mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
