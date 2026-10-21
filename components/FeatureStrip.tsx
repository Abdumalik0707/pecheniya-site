"use client";

import { useLanguage } from "@/lib/i18n";
import { LeafIcon, ChefIcon, TruckIcon, ShieldIcon, HeartIcon } from "@/components/Icons";

export function FeatureStrip() {
  const { t } = useLanguage();

  const features: { icon: React.ReactNode; title: string; desc: string; color: string; bg: string }[] = [
    { icon: <LeafIcon size={20} color="#2d9a4e" />, title: t("feature_ingredients_title"), desc: t("feature_ingredients_desc"), color: "#2d9a4e", bg: "#e6f5ec" },
    { icon: <ChefIcon size={20} color="#8b5e3c" />, title: t("feature_fresh_title"), desc: t("feature_fresh_desc"), color: "#8b5e3c", bg: "#f5ede6" },
    { icon: <TruckIcon size={20} color="#e67e22" />, title: t("feature_delivery_title"), desc: t("feature_delivery_desc"), color: "#e67e22", bg: "#fef0e0" },
    { icon: <ShieldIcon size={20} color="#2d8cf0" />, title: t("feature_payment_title"), desc: t("feature_payment_desc"), color: "#2d8cf0", bg: "#e8f2fd" },
    { icon: <HeartIcon size={20} color="#e74c6f" />, title: t("feature_love_title"), desc: t("feature_love_desc"), color: "#e74c6f", bg: "#fde8ee" },
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
      {features.map((f) => (
        <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", textAlign: "left" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
            {f.icon}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 13.5, fontWeight: 700, color: "var(--fg)" }}>{f.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
