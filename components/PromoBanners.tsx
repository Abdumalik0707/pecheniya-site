"use client";

import Link from "next/link";
import { OPERATOR } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export function PromoBanners() {
  const { t } = useLanguage();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      {/* Wholesale */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "28px 28px",
          borderRadius: 22,
          background: "var(--accent-bg)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "var(--accent-text)", marginBottom: 8 }}>
            {t("promo_wholesale_label")}
          </p>
          <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 18, maxWidth: 260 }}>
            {t("promo_wholesale_title")}
          </h3>
          <a
            href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}
            style={{ display: "inline-block", padding: "12px 24px", borderRadius: 18, background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t("promo_wholesale_btn")}
          </a>
        </div>
        <div style={{ fontSize: 84, opacity: 0.5 }}>🏪</div>
      </div>

      {/* Gift hampers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "28px 28px",
          borderRadius: 22,
          background: "linear-gradient(135deg, #f4c95d22, #d94f3d1a)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#c0392b", marginBottom: 8 }}>
            {t("promo_gift_label")}
          </p>
          <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 18, maxWidth: 260 }}>
            {t("promo_gift_title")}
          </h3>
          <Link
            href="/products/pp020-essen"
            style={{ display: "inline-block", padding: "12px 24px", borderRadius: 18, background: "#c0392b", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t("promo_gift_btn")}
          </Link>
        </div>
        <div style={{ fontSize: 84, opacity: 0.5 }}>🎁</div>
      </div>
    </div>
  );
}
