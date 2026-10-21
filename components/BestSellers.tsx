"use client";

import { useRef } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  user?: { name: string; phone: string; type: string } | null;
  isLoggedIn?: boolean;
}

export function BestSellers({ products, user, isLoggedIn }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        className="pill-row"
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 16,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 8,
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              flex: "0 0 230px",
              scrollSnapAlign: "start",
              display: "flex",
            }}
          >
            <ProductCard product={p} user={user} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollBy(-260)}
        aria-label="Oldingi"
        style={{ ...navBtnStyle, left: -14 }}
        className="bs-nav-btn"
      >
        ‹
      </button>
      <button
        onClick={() => scrollBy(260)}
        aria-label="Keyingi"
        style={{ ...navBtnStyle, right: -14 }}
        className="bs-nav-btn"
      >
        ›
      </button>

      <style>{`
        @media (max-width: 700px) {
          .bs-nav-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "38%",
  transform: "translateY(-50%)",
  width: 36,
  height: 36,
  borderRadius: "50%",
  border: "1px solid var(--border-strong)",
  background: "var(--surface)",
  color: "var(--fg)",
  fontSize: 20,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  boxShadow: "var(--shadow)",
  zIndex: 2,
};
