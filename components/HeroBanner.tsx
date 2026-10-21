"use client";

import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  { src: "/hero/hero-2.png", alt: "Pecheniya — har luqmada haqiqiy mazasi" },
  { src: "/hero/hero-1.png", alt: "Pecheniya — har bir pechenye baxtli daqiqalar uchun" },
];

const AUTOPLAY_MS = 2800;

export function HeroBanner() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, active]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3 / 1",
        borderRadius: 24,
        overflow: "hidden",
        background: "var(--surface-2)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <a href="#mahsulotlar" style={{ display: "block", position: "absolute", inset: 0 }} aria-label="Katalogga o'tish">
        {SLIDES.map((slide, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        ))}
      </a>

      {/* Prev / Next arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        aria-label="Oldingi rasm"
        style={{ ...arrowBtnStyle, left: 14 }}
      >
        ‹
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        aria-label="Keyingi rasm"
        style={{ ...arrowBtnStyle, right: 14 }}
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 7,
          zIndex: 3,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setActive(i); }}
            aria-label={`Rasm ${i + 1}`}
            style={{
              width: active === i ? 20 : 7,
              height: 7,
              padding: 0,
              border: "none",
              borderRadius: 4,
              background: active === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              transition: "all 0.25s",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 3,
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  fontSize: 22,
  lineHeight: "38px",
  textAlign: "center",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};
