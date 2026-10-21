"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProductById, fetchProductById, OPERATOR, Product } from "@/lib/data";
import { OrderModal } from "@/components/OrderModal";
import { Navbar } from "@/components/Navbar";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const staticProduct = getProductById(id);
  const [product, setProduct] = useState<Product | undefined>(staticProduct);
  const [activeImg, setActiveImg] = useState(0);
  const [ordering, setOrdering] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; type: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pecheniya_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);
      if (searchParams.get("open") === "1") {
        setOrdering(true);
      }
    }
    fetchProductById(id).then((p) => { if (p) setProduct(p); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoomed(false); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed]);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <h1 style={{ color: "var(--fg)", marginBottom: 12 }}>Mahsulot topilmadi</h1>
          <Link href="/" style={{ color: "var(--accent)" }}>Asosiy sahifaga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* Orqaga qaytish */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 14,
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            ← Orqaga qaytish
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          {/* Images */}
          <div>
            {/* Main image */}
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label="Rasmni kattalashtirish"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: 24,
                overflow: "hidden",
                background: "#fff",
                border: "1px solid var(--border)",
                marginBottom: 12,
                padding: 0,
                cursor: "zoom-in",
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[activeImg] || product.image}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%" }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  background: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                🔍 Kattalashtirish
              </span>
            </button>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `2px solid ${activeImg === i ? "var(--accent)" : "var(--border)"}`,
                      padding: 0,
                      cursor: "pointer",
                      background: "var(--surface-2)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 12,
                  background: "var(--accent-bg)",
                  color: "var(--accent-text)",
                }}
              >
                {product.categoryLabel}
              </span>
              {product.isNew && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: "rgba(37,99,235,0.12)", color: "var(--blue)" }}>
                  YANGI
                </span>
              )}
              {product.isPremium && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 12, background: "rgba(217,119,6,0.12)", color: "var(--amber)" }}>
                  ⭐ PREMIUM
                </span>
              )}
            </div>

            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>{product.brand}</p>
            <h1
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 900,
                color: "var(--fg)",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {product.name}
            </h1>

            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              {product.descriptionFull}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 10,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Specs */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                marginBottom: 24,
              }}
            >
              {[
                ["📦 Quti og'irligi", product.weight],
                ["⚖️ 1 dona og'irligi", product.netWeight],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>{lbl}</span>
                  <span style={{ color: "var(--fg)", fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div
              style={{
                padding: "18px 20px",
                borderRadius: 16,
                border: "2px solid var(--accent)",
                background: "var(--accent-bg)",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>
                  📦 {product.weight} quti narxi
                </p>
                <p style={{ color: "var(--accent)", fontWeight: 900, fontSize: 26, fontFamily: "var(--font-jakarta)" }}>
                  {product.price.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 700 }}>so&apos;m</span>
                </p>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 12.5, maxWidth: 200, textAlign: "right" }}>
                Ko&apos;proq kerak bo&apos;lsa, buyurtma oynasida &quot;+&quot; tugmasini bosib quti sonini oshiring
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() =>
                  currentUser
                    ? setOrdering(true)
                    : router.push(`/auth/register?redirect=${encodeURIComponent(`/products/${product.id}?open=1`)}`)
                }
                style={{
                  flex: 2,
                  padding: "15px",
                  borderRadius: 20,
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🛒 Buyurtma berish
              </button>
              <a
                href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}
                style={{
                  flex: 1,
                  padding: "15px",
                  borderRadius: 20,
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface)",
                  color: "var(--fg)",
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                📞 Operator
              </a>
            </div>

            {/* Delivery note */}
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                borderRadius: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                fontSize: 13,
                color: "var(--muted)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              ⚡ Toshkent bo&apos;ylab 60 daqiqada yetkazib beramiz
            </div>
          </div>
        </div>
      </div>

      {/* Order modal */}
      {ordering && (
        <OrderModal product={{ ...product, minOrder: 1 }} onClose={() => setOrdering(false)} user={currentUser} />
      )}

      {/* Image lightbox */}
      {zoomed && (
        <div
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-label="Rasm ko'rinishi"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setZoomed(false); }}
            aria-label="Yopish"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              fontSize: 20,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[activeImg] || product.image}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "min(1000px, 95vw)",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 12,
              cursor: "auto",
            }}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          [data-grid] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
