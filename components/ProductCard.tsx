"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data";
import { OrderModal } from "./OrderModal";
import { useLanguage } from "@/lib/i18n";

interface Props {
  product: Product;
  user?: { name: string; phone: string; type: string } | null;
  isLoggedIn?: boolean;
}

export function ProductCard({ product, user, isLoggedIn }: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const [ordering, setOrdering] = useState(false);

  function handleOrderClick() {
    if (!isLoggedIn) {
      const back = encodeURIComponent(`/products/${product.id}?open=1`);
      router.push(`/auth/register?redirect=${back}`);
      return;
    }
    setOrdering(true);
  }

  return (
    <>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
          transition: "box-shadow 0.2s, transform 0.2s",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Image — click goes to detail page */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              background: "var(--surface-2)",
              position: "relative",
              overflow: "hidden",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 0.3s",
                  padding: "24px 20px",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.05)")}
                onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
              />
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 64, opacity: 0.4 }}>🍪</div>
            )}

            {/* Badges */}
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
              {product.isNew && (
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: "var(--blue)", color: "#fff" }}>
                  YANGI
                </span>
              )}
              {product.isPremium && (
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 8, background: "var(--amber)", color: "#fff" }}>
                  ⭐ PREMIUM
                </span>
              )}
            </div>

            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 10,
              }}
            >
              {product.weight}
            </div>
          </div>
        </Link>

        {/* Info */}
        <div style={{ padding: "14px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            {product.brand}
          </p>
          <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontFamily: "var(--font-jakarta)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--fg)",
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </h3>
          </Link>
          <p style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.5, marginBottom: 12, flex: 1 }}>
            {product.description}
          </p>

          {/* Price row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: 17 }}>
                {product.price.toLocaleString()}
              </span>
              <span style={{ color: "var(--muted)", fontSize: 11 }}> so&apos;m / {product.unit}</span>
            </div>
            <div style={{ color: "var(--muted)", fontSize: 11 }}>
              {product.weight}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleOrderClick}
              style={{
                flex: 2,
                padding: "9px 0",
                borderRadius: 12,
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("order_btn")}
            </button>
            <Link
              href={`/products/${product.id}`}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 12,
                border: "1px solid var(--border-strong)",
                background: "transparent",
                color: "var(--fg)",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              {t("view_btn")}
            </Link>
          </div>
        </div>
      </div>

      {ordering && (
        <OrderModal
          product={{ ...product, minOrder: 1 }}
          onClose={() => setOrdering(false)}
          user={user}
        />
      )}
    </>
  );
}
