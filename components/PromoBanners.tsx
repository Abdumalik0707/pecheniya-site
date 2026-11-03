"use client";

import Link from "next/link";
import { OPERATOR } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export function PromoBanners() {
  const { t } = useLanguage();

  return (
    <div className="promos">
      {/* Wholesale */}
      <div className="promo choco">
        <p className="promo-label">{t("promo_wholesale_label")}</p>
        <h3>{t("promo_wholesale_title")}</h3>
        <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`} className="btn btn-yellow">
          {t("promo_wholesale_btn")} <span className="arrow-ico">→</span>
        </a>
        <div className="promo-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/smag/pp011-yubileynoe-moskva.jpg" alt="" loading="lazy" />
        </div>
      </div>

      {/* Gift */}
      <div className="promo red">
        <p className="promo-label">{t("promo_gift_label")}</p>
        <h3>{t("promo_gift_title")}</h3>
        <Link href="/products/pp020-essen" className="btn btn-yellow">
          {t("promo_gift_btn")} <span className="arrow-ico">→</span>
        </Link>
        <div className="promo-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/products/smag/pp005-sasha-masha-choko.jpg" alt="" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
