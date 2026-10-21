"use client";

import { useLanguage } from "@/lib/i18n";

export function TopBar() {
  const { t } = useLanguage();

  const items = [t("topbar_shipping"), t("topbar_promo"), t("topbar_fresh")];

  return (
    <div
      style={{
        background: "var(--accent-text)",
        color: "#fff",
        fontSize: 12.5,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            {i > 0 && <span style={{ opacity: 0.5 }}>|</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
