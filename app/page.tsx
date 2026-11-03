"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCircles } from "@/components/CategoryCircles";
import { BestSellers } from "@/components/BestSellers";
import { PromoBanners } from "@/components/PromoBanners";
import { Drip } from "@/components/Drip";
import { Ribbons } from "@/components/Ribbons";
import { HeroBanner } from "@/components/HeroBanner";
import { PRODUCTS, OPERATOR, fetchProducts, Product } from "@/lib/data";
import { useLanguage, type TranslationKey } from "@/lib/i18n";
import {
  CookieIcon, SendIcon, CameraIcon, PhoneIcon,
  LeafIcon, ChefIcon, TruckIcon, ShieldIcon, HeartIcon,
} from "@/components/Icons";

const TYPE_FILTERS: { key: string; label: string; tag: string }[] = [
  { key: "shokoladli", label: "Shokoladli", tag: "shokolad" },
  { key: "kunjutlik", label: "Kunjutlik", tag: "kunjut" },
  { key: "lochira", label: "Lochira seriyasi", tag: "lochira" },
];

const MOSAIC = [
  ["pp001-kunjut-lochira", "Lochira"],
  ["pp005-sasha-masha-choko", "Sasha-Masha"],
  ["pp007-vostochny-kunjut-choko", "Kunjut"],
  ["pp009-yubileynoe-kichik", "Yubileynoe"],
  ["pp012-selfi-smag-choko", "Selfi"],
  ["pp014-yabloko", "Olma"],
  ["pp015-vkusnoe", "Vkusnoe"],
  ["pp016-chayku", "Chayku"],
  ["pp017-popkorn", "Popkorn"],
  ["pp018-toplyonoe-moloko", "Moloko"],
  ["pp020-essen", "Essen"],
  ["pp003-kunjut-lochira-choko", "Choko"],
  ["pp010-yubileynoe-elita", "Elita"],
  ["pp006-sasha-masha", "Sasha"],
  ["pp019-toplyonoe-moloko-temny", "Temny"],
] as const;

const INGREDIENTS: { t: TranslationKey; d: TranslationKey }[] = [
  { t: "ing_flour_t", d: "ing_flour_d" },
  { t: "ing_milk_t", d: "ing_milk_d" },
  { t: "ing_sesame_t", d: "ing_sesame_d" },
  { t: "ing_choco_t", d: "ing_choco_d" },
];

function CurlyArrow() {
  return (
    <svg className="ing-arrow" viewBox="0 0 54 40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 6c14 0 26 6 32 20 2 4 6 8 14 8" />
      <path d="M40 27l8 7-9 4" />
    </svg>
  );
}

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
  const telHref = `tel:${OPERATOR.phone.replace(/\s/g, "")}`;

  function handleCategorySelect(sub: string | null) {
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

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="hero-kicker">
              <CookieIcon size={16} color="var(--brand-yellow)" /> {t("hero_kicker")}
            </div>
            <h1 className="hero-title">
              <span>{t("hero_big_1")}</span>
              <span className="yel">{t("hero_big_2")}</span>
            </h1>
            <p className="hero-sub">{t("hero_sub")}</p>
            <div className="hero-actions">
              <a href="#mahsulotlar" className="btn btn-yellow">
                {t("bestsellers_viewall").replace(/\s*→\s*$/, "")} <span className="arrow-ico">→</span>
              </a>
              <a href={telHref} className="btn btn-ghost-light">
                <PhoneIcon size={16} color="currentColor" /> {t("hero_cta_call")}
              </a>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero/hero-2.png" alt="" />
            </div>
            <div className="hero-pack">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/smag-logo.png" alt="" className="hero-pack-logo" />
              <div className="hero-pack-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/products/smag/pp004-lochira-choko.jpg" alt="" />
              </div>
              <div className="hero-pack-band">
                <b>LOCHIRA</b>
                <small>{t("hero_pack_sub")}<br />choko</small>
              </div>
            </div>
            <div className="hero-cookie c1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/smag/pp008-vostochny-kunjut.jpg" alt="" />
            </div>
            <div className="hero-cookie c2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/smag/pp010-yubileynoe-elita.jpg" alt="" />
            </div>
            <div className="hero-sticker">
              <div>
                <b>60</b>
                <span>{t("hero_sticker")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Drip />

      {/* ─── PHOTO CAROUSEL ─── */}
      <section className="wrap" style={{ padding: "36px 24px 56px" }}>
        <HeroBanner />
      </section>

      <Ribbons />

      {/* ─── RECIPE / INGREDIENTS ─── */}
      <section className="recipe">
        <div className="wrap">
          <h2 className="sec-title" style={{ textAlign: "center" }}>{t("recipe_title")}</h2>
          <div className="recipe-grid">
            <div className="recipe-col left">
              {INGREDIENTS.slice(0, 2).map((i) => (
                <div key={i.t} className="ing-card">
                  <h4>{t(i.t)}</h4>
                  <p>{t(i.d)}</p>
                  <CurlyArrow />
                </div>
              ))}
            </div>
            <div className="recipe-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/smag/pp007-vostochny-kunjut-choko.jpg" alt="SmaG pechene" />
            </div>
            <div className="recipe-col right">
              {INGREDIENTS.slice(2).map((i) => (
                <div key={i.t} className="ing-card">
                  <h4>{t(i.t)}</h4>
                  <p>{t(i.d)}</p>
                  <CurlyArrow />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ─── */}
      <section className="wrap" style={{ paddingBottom: 24 }}>
        <div className="row-head">
          <h2>{t("bestsellers_title")}.</h2>
          <a href="#mahsulotlar" className="dot-link">{t("bestsellers_viewall").replace(/\s*→\s*$/, "")}</a>
        </div>
        <div className="best-layout">
          <div style={{ minWidth: 0 }}>
            <BestSellers products={bestSellers} user={currentUser} isLoggedIn={isLoggedIn} />
          </div>
          <div className="wholesale-card">
            <div className="wc-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/smag/pp020-essen.jpg" alt="" />
            </div>
            <h3>{t("wholesale_card_title")}</h3>
            <p>{t("wholesale_card_desc")}</p>
            <a href={telHref} className="btn btn-yellow btn-sm" style={{ alignSelf: "flex-start" }}>
              {t("promo_wholesale_btn")} <span className="arrow-ico">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="wrap">
        <div className="story">
          <div className="story-mosaic" aria-hidden="true">
            <div className="story-mosaic-inner">
              {[...MOSAIC, ...MOSAIC, ...MOSAIC].map(([id, label], i) => (
                <div key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/products/smag/${id}.jpg`} alt="" loading="lazy" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-panel">
            <h2>{t("story_title")}</h2>
            <div className="bar" />
            <p>{t("story_desc")}</p>
            <ul className="story-points">
              <li><i><LeafIcon size={16} color="#ffc72c" /></i>{t("feature_ingredients_title")} — {t("feature_ingredients_desc")}</li>
              <li><i><ChefIcon size={16} color="#ffc72c" /></i>{t("feature_fresh_title")} — {t("feature_fresh_desc")}</li>
              <li><i><TruckIcon size={16} color="#ffc72c" /></i>{t("feature_delivery_title")} — {t("feature_delivery_desc")}</li>
              <li><i><ShieldIcon size={16} color="#ffc72c" /></i>{t("feature_payment_title")} — {t("feature_payment_desc")}</li>
            </ul>
            <a href="#mahsulotlar" className="btn btn-yellow" style={{ alignSelf: "flex-start" }}>
              {t("story_btn")} <span className="arrow-ico">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="row-head">
          <h2>{t("cats_title")}.</h2>
          <a href="#mahsulotlar" className="dot-link">{t("filter_all")}</a>
        </div>
        <CategoryCircles onSelect={handleCategorySelect} />
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="qanday" className="wrap" style={{ paddingBottom: 80, scrollMarginTop: 90 }}>
        <div className="how">
          <div className="how-hero">
            <h2>{t("how_title")}</h2>
            <p>{t("how_desc")}</p>
            <a href="#mahsulotlar" className="btn btn-red">
              {t("how_cta")} <span className="arrow-ico">→</span>
            </a>
          </div>
          {([
            [1, "how_1_title", "how_1_desc"],
            [2, "how_2_title", "how_2_desc"],
            [3, "how_3_title", "how_3_desc"],
            [4, "how_4_title", "how_4_desc"],
          ] as const).map(([step, title, desc]) => (
            <div key={step} className="how-step">
              <div className="num">{step}</div>
              <h3>{t(title)}</h3>
              <p>{t(desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATALOG ─── */}
      <section id="mahsulotlar" className="wrap" style={{ paddingBottom: 72, scrollMarginTop: 90 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 className="sec-title" style={{ marginBottom: 10 }}>{t("catalog_title")}</h2>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>{t("catalog_desc")}</p>
        </div>

        {/* Mobile: "Turini tanlash" toggle */}
        <button
          className="type-filter-toggle-mobile pill"
          onClick={() => setTypeFilterOpen(!typeFilterOpen)}
          style={{ display: "none", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CookieIcon size={16} color="var(--accent)" /> Turini tanlash
            {subFilter ? `: ${TYPE_FILTERS.find((f) => f.key === subFilter)?.label ?? subFilter}` : ""}
          </span>
          <span>{typeFilterOpen ? "▲" : "▼"}</span>
        </button>

        <div
          className={`pill-row type-filter-row ${typeFilterOpen ? "is-open" : ""}`}
          style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", padding: "4px 2px 8px", scrollbarWidth: "none", justifyContent: "center" }}
        >
          <button onClick={() => setSubFilter(null)} className={`pill ${subFilter === null ? "is-active" : ""}`}>
            {t("filter_all")}
          </button>
          {TYPE_FILTERS.map(({ key, label }) => (
            <button key={key} onClick={() => setSubFilter(key)} className={`pill ${subFilter === key ? "is-active" : ""}`}>
              {label}
            </button>
          ))}
          {subFilter && !TYPE_FILTERS.some((f) => f.key === subFilter) && (
            <button className="pill is-active" onClick={() => setSubFilter(null)}>
              {subFilter} ✕
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} user={currentUser} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      </section>

      {/* ─── PROMOS ─── */}
      <section className="wrap" style={{ paddingBottom: 110 }}>
        <PromoBanners />
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="news">
        <div className="news-inner">
          <div className="news-cookie" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/products/smag/pp009-yubileynoe-kichik.jpg" alt="" />
          </div>
          <h3>{t("news_title")}</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t("footer_newsletter_ph")} aria-label={t("footer_newsletter_ph")} />
            <button type="submit" className="btn btn-yellow btn-sm">{t("footer_subscribe")}</button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/smag-logo.png" alt="SmaG" style={{ height: 46, width: "auto", borderRadius: 8 }} />
                <span className="display" style={{ fontSize: 26 }}>PECHENIYA</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.88, marginBottom: 18, maxWidth: 300 }}>
                {t("footer_about_desc")}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={OPERATOR.telegramUrl} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Telegram" title={OPERATOR.telegram}>
                  <SendIcon size={16} color="#fff6ea" />
                </a>
                <span className="footer-social" aria-label="Instagram" title="Instagram">
                  <CameraIcon size={16} color="#fff6ea" />
                </span>
                <a href={telHref} className="footer-social" aria-label="Telefon" title={OPERATOR.phone}>
                  <PhoneIcon size={16} color="#fff6ea" />
                </a>
              </div>
            </div>

            <div>
              <h4>{t("footer_quicklinks")}</h4>
              <div className="footer-links">
                <Link href="/">{t("catalog_label")}</Link>
                <a href="#mahsulotlar">{t("nav_products")}</a>
                <a href="#qanday">{t("nav_how")}</a>
                <Link href="/auth/login">{t("nav_login")}</Link>
              </div>
            </div>

            <div>
              <h4>{t("footer_customercare")}</h4>
              <div className="footer-links">
                <a href={telHref}>{t("footer_link_contact")}</a>
                <span>{t("footer_link_about")}</span>
                <span>{t("footer_link_faq")}</span>
                <span>{t("footer_link_delivery")}</span>
                <span>{t("footer_link_returns")}</span>
              </div>
            </div>

            <div>
              <h4>{t("operator_contact")}</h4>
              <div className="footer-links">
                <a href={telHref} style={{ fontWeight: 700, fontSize: 17 }}>{OPERATOR.phone}</a>
                <a href={OPERATOR.telegramUrl} target="_blank" rel="noopener noreferrer">{OPERATOR.telegram}</a>
                <span style={{ lineHeight: 1.5 }}>{OPERATOR.address}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <HeartIcon size={14} color="#ffc72c" /> {t("feature_love_desc")}
                </span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 {OPERATOR.name} · {OPERATOR.website}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ opacity: 0.85, fontSize: 12 }}>{t("footer_payment")}:</span>
              {["Payme", "Click", "Uzcard", "Humo"].map((p) => (
                <span key={p} className="pay-chip">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .pill-row::-webkit-scrollbar { display: none; }
        @media (max-width: 700px) {
          .type-filter-toggle-mobile { display: flex !important; }
          .type-filter-row { display: none !important; }
          .type-filter-row.is-open { display: flex !important; flex-wrap: wrap; justify-content: flex-start !important; }
        }
      `}</style>
    </div>
  );
}
