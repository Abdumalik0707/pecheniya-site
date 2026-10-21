"use client";

import { useLanguage } from "@/lib/i18n";

export function FeatureStrip() {
  const { t } = useLanguage();

  const features: [string, string, string][] = [
    ["🌾", t("feature_ingredients_title"), t("feature_ingredients_desc")],
    ["👩‍🍳", t("feature_fresh_title"), t("feature_fresh_desc")],
    ["🚚", t("feature_delivery_title"), t("feature_delivery_desc")],
    ["🛡️", t("feature_payment_title"), t("feature_payment_desc")],
    ["😊", t("feature_love_title"), t("feature_love_desc")],
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 20,
        padding: "28px 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {features.map(([icon, title, desc]) => (
        <div key={title} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", textAlign: "left" }}>
          <span style={{ fontSize: 26 }}>{icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 13.5, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
