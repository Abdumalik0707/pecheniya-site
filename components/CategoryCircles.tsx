"use client";

interface CircleItem {
  icon: string;
  label: string;
  sub: string;
}

const CIRCLES: CircleItem[] = [
  { icon: "/products/smag/pp002-lochira.jpg", label: "Lochira", sub: "Lochira seriyasi" },
  { icon: "/products/smag/pp006-sasha-masha.jpg", label: "Sasha-Masha", sub: "Sasha-Masha seriyasi" },
  { icon: "/products/smag/pp008-vostochny-kunjut.jpg", label: "Sharqona kunjut", sub: "Sharqona kunjut" },
  { icon: "/products/smag/pp010-yubileynoe-elita.jpg", label: "Yubileynoe", sub: "Yubileynoe seriyasi" },
  { icon: "/products/smag/pp013-selfi-smag.jpg", label: "Selfi SmaG", sub: "Selfi SmaG" },
  { icon: "/products/smag/pp014-yabloko.jpg", label: "Mevali", sub: "Mevali pechene" },
  { icon: "/products/smag/pp020-essen.jpg", label: "Sendvich", sub: "Sendvich pechene" },
];

interface Props {
  onSelect: (sub: string) => void;
}

export function CategoryCircles({ onSelect }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 22,
        overflowX: "auto",
        padding: "6px 4px 10px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {CIRCLES.map((c) => (
        <button
          key={c.label}
          onClick={() => onSelect(c.sub)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            width: 96,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              transition: "border-color 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.icon} alt={c.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)", textAlign: "center", lineHeight: 1.3 }}>
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}
