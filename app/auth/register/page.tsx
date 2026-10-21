"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [type, setType] = useState<"individual" | "shop">("individual");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (pass !== passConfirm) {
      setError("Parollar mos kelmadi");
      return;
    }
    if (pass.length < 6) {
      setError("Parol kamida 6 belgi bo'lishi kerak");
      return;
    }
    if (type === "shop" && !shopName.trim()) {
      setError("Do'kon nomini kiriting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password: pass, type, shopName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        return;
      }

      // Save to localStorage too for session
      localStorage.setItem("pecheniya_user", JSON.stringify(data.user));
      setSuccess(true);

      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
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
        <div style={{ width: "100%", maxWidth: 440 }}>
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
              Ro&apos;yxatdan o&apos;tish
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Buyurtma berish uchun akkaunt yarating
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
            {success ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
                  Muvaffaqiyatli!
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>
                  Ro&apos;yxatdan o&apos;tdingiz. Bosh sahifaga yo&apos;naltirilmoqdasiz...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Type selector */}
                <div>
                  <label style={labelStyle}>Siz kimsiz?</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {([
                      ["individual", "👤 Oddiy mijoz"],
                      ["shop", "🏪 Do'kon egasi"],
                    ] as const).map(([val, lbl]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setType(val)}
                        style={{
                          flex: 1,
                          padding: "12px 8px",
                          borderRadius: 14,
                          border: `2px solid ${type === val ? "var(--accent)" : "var(--border)"}`,
                          background: type === val ? "var(--accent-bg)" : "var(--surface-2)",
                          color: type === val ? "var(--accent-text)" : "var(--muted)",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={labelStyle}>To&apos;liq ism</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingiz va familiyangiz"
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Shop name (only for shop) */}
                {type === "shop" && (
                  <div>
                    <label style={labelStyle}>Do&apos;kon nomi</label>
                    <input
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Do'koningiz nomi"
                      style={inputStyle}
                      required
                    />
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Telefon raqam</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 000 00 00"
                    style={inputStyle}
                    required
                    type="tel"
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Parol</label>
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Kamida 6 belgi"
                    style={inputStyle}
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm password */}
                <div>
                  <label style={labelStyle}>Parolni tasdiqlang</label>
                  <input
                    type="password"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    style={{
                      ...inputStyle,
                      borderColor:
                        passConfirm && pass !== passConfirm
                          ? "var(--red)"
                          : "var(--border-strong)",
                    }}
                    required
                  />
                  {passConfirm && pass !== passConfirm && (
                    <p style={{ color: "var(--red)", fontSize: 12, marginTop: 4 }}>
                      Parollar mos kelmadi
                    </p>
                  )}
                </div>

                {/* Error */}
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

                {/* Submit */}
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
                      Saqlanmoqda...
                    </>
                  ) : (
                    "Ro'yxatdan o'tish →"
                  )}
                </button>

                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
                  Akkaunt bormi?{" "}
                  <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                    Kirish
                  </Link>
                </p>
              </form>
            )}
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
