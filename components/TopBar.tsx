"use client";

import { useLanguage } from "@/lib/i18n";
import { TruckIcon, GiftIcon, ChefIcon } from "./Icons";

export function TopBar() {
  const { t } = useLanguage();

  const items = [
    { Icon: TruckIcon, text: t("topbar_shipping") },
    { Icon: GiftIcon, text: t("topbar_promo") },
    { Icon: ChefIcon, text: t("topbar_fresh") },
  ];

  return (
    <div
      style={{
        background: "var(--brand-choco-deep)",
        color: "var(--brand-cream)",
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
          <span key={i} className={i > 0 ? "tb-extra" : undefined} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span aria-hidden="true" style={{ opacity: 0.35, margin: "0 6px" }}>•</span>}
            <item.Icon size={15} color="var(--brand-yellow)" />
            {item.text}
          </span>
        ))}
      </div>
      {/* phones: keep only the first message so the bar stays one line */}
      <style>{`@media (max-width: 700px) { .tb-extra { display: none !important; } }`}</style>
    </div>
  );
}
