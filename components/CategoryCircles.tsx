"use client";

import { useLanguage } from "@/lib/i18n";

interface CategoryItem {
  icon: string;
  label: string;
  sub: string;
}

const CATEGORIES: CategoryItem[] = [
  { icon: "/products/smag/pp002-lochira.jpg", label: "Lochira", sub: "Lochira seriyasi" },
  { icon: "/products/smag/pp006-sasha-masha.jpg", label: "Sasha-Masha", sub: "Sasha-Masha seriyasi" },
  { icon: "/products/smag/pp008-vostochny-kunjut.jpg", label: "Sharqona kunjut", sub: "Sharqona kunjut" },
  { icon: "/products/smag/pp010-yubileynoe-elita.jpg", label: "Yubileynoe", sub: "Yubileynoe seriyasi" },
  { icon: "/products/smag/pp013-selfi-smag.jpg", label: "Selfi SmaG", sub: "Selfi SmaG" },
  { icon: "/products/smag/pp014-yabloko.jpg", label: "Mevali", sub: "Mevali pechene" },
  { icon: "/products/smag/pp020-essen.jpg", label: "Sendvich", sub: "Sendvich pechene" },
];

interface Props {
  onSelect: (sub: string | null) => void;
}

// Arch-topped category cards with a coloured label tab (kept the old export name).
export function CategoryCircles({ onSelect }: Props) {
  const { t } = useLanguage();

  return (
    <div className="cat-grid">
      {CATEGORIES.map((c) => (
        <button key={c.label} className="cat-card" onClick={() => onSelect(c.sub || null)}>
          <div className="cat-card-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.icon} alt={c.label} loading="lazy" />
          </div>
          <div className="cat-card-tab">
            <b>{c.label}</b>
            <span className="btn btn-yellow btn-sm">
              {t("cats_btn")} <span className="arrow-ico">→</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
