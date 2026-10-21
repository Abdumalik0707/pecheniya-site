"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { FeatureStrip } from "@/components/FeatureStrip";
import { CategoryCircles } from "@/components/CategoryCircles";
import { BestSellers } from "@/components/BestSellers";
import { PromoBanners } from "@/components/PromoBanners";
import { PRODUCTS, OPERATOR, fetchProducts, Product } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

const TYPE_FILTERS: { key: string; label: string; tag: string }[] = [
  { key: "shokoladli", label: "Shokoladli", tag: "shokolad" },
  { key: "kunjutlik", label: "Kunjutlik", tag: "kunjut" },
  { key: "lochira", label: "Lochira seriyasi", tag: "lochira" },
];

export default function Home() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; type: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("pecheniya_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setIsLoggedIn(true);
      setCurrentUser(parsed);
    }
    fetchProducts().then((p) => setProducts(p));
    setLoading(false);
  }, []);

  const filtered = (() => {
    if (!subFilter) return products;
    const typeMatch = TYPE_FILTERS.find((f) => f.key === subFilter);
    if (typeMatch) return products.filter((p) => p.tags.includes(typeMatch.tag));
    return products.filter((p) => p.categoryLabel === subFilter);
  })();

  const bestSellers = products.filter((p) => p.isPremium || p.isNew).slice(0, 10);

  function handleCircleSelect(sub: string | null) {
    setSubFilter(sub);
    document.getElementById("mahsulotlar")?.scrollIntoView({ behavior: "smooth" });
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--muted)", fontSize: 16 }}>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 0" }}>
        <HeroBanner />

        {/* Quick badge + call CTA under the banner */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--accent-bg)",
              color: "var(--accent-text)",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {t("hero_badge")}
          </div>
          <a
            href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 20,
              background: "var(--surface-2)",
              color: "var(--fg)",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
              border: "1px solid var(--border-strong)",
            }}
          >
            📞 {OPERATOR.phone}
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 40, padding: "8px 0 44px", flexWrap: "wrap" }}>
          {[
            ["🍪", `${products.length}+`, t("stat_flavors")],
            ["⭐", `${products.filter(p => p.isPremium).length}`, t("stat_food")],
            ["🆕", `${products.filter(p => p.isNew).length}`, t("stat_organic")],
            ["⚡", "60 min", t("stat_delivery")],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--fg)" }}>{val}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <FeatureStrip />
      </section>

      {/* Shop by category */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>
            {t("category_section_label")}
          </p>
          <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "var(--fg)" }}>
            {t("category_section_title")}
          </h2>
        </div>
        <CategoryCircles onSelect={handleCircleSelect} />
      </section>

      {/* Best sellers */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>
              {t("bestsellers_label")}
            </p>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "var(--fg)" }}>
              {t("bestsellers_title")}
            </h2>
          </div>
          <a href="#mahsulotlar" style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            {t("bestsellers_viewall")}
          </a>
        </div>
        <BestSellers products={bestSellers} user={currentUser} isLoggedIn={isLoggedIn} />
      </section>

      {/* How it works */}
      <section id="qanday" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, textAlign: "center", color: "var(--fg)", marginBottom: 36 }}>
            {t("how_title")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              ["1️⃣", t("how_1_title"), t("how_1_desc")],
              ["2️⃣", t("how_2_title"), t("how_2_desc")],
              ["3️⃣", t("how_3_title"), t("how_3_desc")],
              ["4️⃣", t("how_4_title"), t("how_4_desc")],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ padding: "22px", borderRadius: 18, background: "var(--bg-2)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="mahsulotlar" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>
            {t("catalog_label")}
          </p>
          <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 800, color: "var(--fg)", marginBottom: 10 }}>
            {t("catalog_title")}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>
            {t("catalog_desc")}
          </p>
        </div>

        {/* Mobile: "Turini tanlash" toggle */}
        <button
          className="type-filter-toggle-mobile"
          onClick={() => setTypeFilterOpen(!typeFilterOpen)}
          style={{
            display: "none",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderRadius: 14,
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            color: "var(--fg)",
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 14,
            cursor: "pointer",
          }}
        >
          <span>🍪 Turini tanlash{subFilter ? `: ${TYPE_FILTERS.find((f) => f.key === subFilter)?.label ?? ""}` : ""}</span>
          <span>{typeFilterOpen ? "▲" : "▼"}</span>
        </button>

        {/* Type pills: Shokoladli / Kunjutlik / Lochira seriyasi */}
        <div
          className={`pill-row type-filter-row ${typeFilterOpen ? "is-open" : ""}`}
          style={{ display: "flex", gap: 8, marginBottom: 36, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setSubFilter(null)}
            style={{
              flexShrink: 0,
              padding: "7px 16px",
              borderRadius: 16,
              border: `1px solid ${subFilter === null ? "var(--accent)" : "var(--border)"}`,
              background: subFilter === null ? "var(--accent-bg)" : "transparent",
              color: subFilter === null ? "var(--accent-text)" : "var(--muted)",
              fontWeight: 600,
              fontSize: 12.5,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t("filter_all")}
          </button>
          {TYPE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSubFilter(key)}
              style={{
                flexShrink: 0,
                padding: "7px 16px",
                borderRadius: 16,
                border: `1px solid ${subFilter === key ? "var(--accent)" : "var(--border)"}`,
                background: subFilter === key ? "var(--accent-bg)" : "transparent",
                color: subFilter === key ? "var(--accent-text)" : "var(--muted)",
                fontWeight: 600,
                fontSize: 12.5,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} user={currentUser} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </section>

      {/* Promo banners */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 48px" }}>
        <PromoBanners />
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)", padding: "48px 24px 0" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr",
            gap: 32,
            paddingBottom: 36,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 900, color: "var(--fg)", marginBottom: 10 }}>
              🍪 PECHENIYA
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 16, maxWidth: 260 }}>
              {t("footer_about_desc")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a
                href={OPERATOR.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 34, height: 34, borderRadius: "50%", background: "var(--surface-2)",
                  border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: 14,
                  textDecoration: "none",
                }}
                aria-label="Telegram"
                title={OPERATOR.telegram}
              >
                ✈️
              </a>
              <span
                style={{
                  width: 34, height: 34, borderRadius: "50%", background: "var(--surface-2)",
                  border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: 14,
                }}
                aria-label="Instagram"
                title="Instagram"
              >
                📷
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              {t("footer_quicklinks")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/" style={footerLinkStyle}>{t("catalog_label")}</Link>
              <a href="#mahsulotlar" style={footerLinkStyle}>{t("nav_products")}</a>
              <a href="#qanday" style={footerLinkStyle}>{t("nav_how")}</a>
              <Link href="/auth/login" style={footerLinkStyle}>{t("nav_login")}</Link>
            </div>
          </div>

          {/* Customer care */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              {t("footer_customercare")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`} style={footerLinkStyle}>{t("footer_link_contact")}</a>
              <span style={footerLinkStyle}>{t("footer_link_about")}</span>
              <span style={footerLinkStyle}>{t("footer_link_faq")}</span>
              <span style={footerLinkStyle}>{t("footer_link_delivery")}</span>
              <span style={footerLinkStyle}>{t("footer_link_returns")}</span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
              {t("footer_newsletter")}
            </h4>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
              {t("footer_newsletter_desc")}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", gap: 8 }}
            >
              <input
                type="email"
                placeholder={t("footer_newsletter_ph")}
                style={{
                  flex: 1, minWidth: 0, height: 42, borderRadius: 12, border: "1px solid var(--border-strong)",
                  background: "var(--surface)", padding: "0 14px", fontSize: 13, color: "var(--fg)", outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0 18px", borderRadius: 12, border: "none", background: "var(--accent)",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {t("footer_subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderTop: "1px solid var(--border)",
            padding: "18px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: 12.5 }}>
            © 2026 {OPERATOR.name} · {OPERATOR.website}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 11.5 }}>{t("footer_payment")}:</span>
            {["Payme", "Click", "Uzcard", "Humo"].map((p) => (
              <span
                key={p}
                style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
                  background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--muted)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        .pill-row::-webkit-scrollbar { display: none; }
        @media (max-width: 700px) {
          .type-filter-toggle-mobile { display: flex !important; }
          .type-filter-row { display: none !important; }
          .type-filter-row.is-open { display: flex !important; flex-wrap: wrap; }
        }
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 13,
  textDecoration: "none",
};
