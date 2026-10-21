"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+998 ");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Admin faqat username orqali kiradi (frontend'da "+" bilan boshlanmagan kirish)
      const trimmed = phone.trim();
      const isUsername = !trimmed.startsWith("+");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isUsername
            ? { username: trimmed, password: pass }
            : { phone: trimmed, password: pass }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        return;
      }

      localStorage.setItem("pecheniya_user", JSON.stringify(data.user));

      if (data.user.isAdmin || data.user.type === "admin") {
        router.push("/");
      } else {
        router.push("/");
      }
    } catch {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          minHeight: "calc(100vh - 68px)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍪</div>
            <h1
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: 28,
                fontWeight: 900,
                color: "var(--fg)",
                marginBottom: 8,
              }}
            >
              Kirish
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Akkauntingizga kiring
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              padding: "32px",
              boxShadow: "var(--shadow)",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Telefon raqam</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => {
                    if (!phone.trim() || phone === "+998 ") {
                      e.target.setSelectionRange(phone.length, phone.length);
                    }
                  }}
                  placeholder="+998 90 000 00 00"
                  style={inputStyle}
                  required
                  autoComplete="username"
                  inputMode="tel"
                />
              </div>

              <div>
                <label style={labelStyle}>Parol</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Parolingiz"
                  style={inputStyle}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "var(--red)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px",
                  borderRadius: 20,
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Kirish →"
                )}
              </button>

              <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
                Akkaunt yo&apos;qmi?{" "}
                <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </p>
            </form>
          </div>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--muted)",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  borderRadius: 14,
  border: "1px solid var(--border-strong)",
  background: "var(--surface-2)",
  padding: "0 16px",
  fontSize: 15,
  color: "var(--fg)",
  outline: "none",
  boxSizing: "border-box",
};
