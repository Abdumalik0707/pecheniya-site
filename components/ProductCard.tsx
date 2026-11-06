"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data";
import { OrderModal } from "./OrderModal";
import { useLanguage } from "@/lib/i18n";
import { CookieIcon, StarIcon } from "./Icons";
import { unitPriceOf } from "@/lib/pricing";

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
      <div className="pcard">
        {/* Image — click goes to detail page */}
        <Link href={`/products/${product.id}`} className="pcard-img">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} />
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", opacity: 0.3 }}>
              <CookieIcon size={56} color="var(--muted)" />
            </div>
          )}

          <div className="pcard-badges">
            {product.isNew && (
              <span className="pcard-badge" style={{ background: "var(--brand-red)" }}>
                YANGI
              </span>
            )}
            {product.isPremium && (
              <span className="pcard-badge" style={{ background: "var(--brand-choco)" }}>
                <StarIcon size={10} color="#ffc72c" /> PREMIUM
              </span>
            )}
          </div>

          <div className="pcard-weight">{product.weight}</div>
        </Link>

        {/* Info */}
        <div className="pcard-body">
          <div className="pcard-stars" aria-label="5/5">
            {[0, 1, 2, 3, 4].map((i) => (
              <StarIcon key={i} size={13} color="#f2a900" />
            ))}
          </div>
          <Link href={`/products/${product.id}`} className="pcard-name">
            {product.name}
          </Link>
          <p className="pcard-desc">{product.description}</p>

          <div className="pcard-price">
            <b>{unitPriceOf(product, user?.type).toLocaleString()}</b>
            <span>so&apos;m / {product.unit}{(product.priceType ?? user?.type) === "shop" ? " · do'kon" : ""}</span>
          </div>

          <div className="pcard-actions">
            <button onClick={handleOrderClick} className="pcard-order">
              {t("order_btn")}
            </button>
            <Link href={`/products/${product.id}`} className="pcard-view" aria-label={t("view_btn")} title={t("view_btn")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
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
