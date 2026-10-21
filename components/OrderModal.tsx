"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

const LocationMap = dynamic(() => import("./LocationMap").then((m) => m.LocationMap), {
  ssr: false,
  loading: () => (
    <div style={{ height: 280, background: "var(--surface-2)", borderRadius: 14, display: "grid", placeItems: "center", color: "var(--muted)", fontSize: 14 }}>
      Xarita yuklanmoqda...
    </div>
  ),
});

interface Props {
  product: Product;
  onClose: () => void;
  user?: { name: string; phone: string; type: string } | null;
}

export function OrderModal({ product, onClose, user }: Props) {
  const { t } = useLanguage();
  const [qty, setQty] = useState(product.minOrder ?? 1);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [customerType, setCustomerType] = useState<"individual" | "shop">(
    (user?.type as "individual" | "shop") || "individual"
  );
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [step, setStep] = useState<"info" | "map" | "confirm" | "done">("info");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const total = product.price * (qty ?? 1);

  async function handleSubmit() {
    if (!location) { setStep("map"); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name || user?.name,
          customerPhone: phone || user?.phone,
          customerAddress: location.address,
          customerLat: location.lat,
          customerLng: location.lng,
          customerType,
          products: [
            {
              productId: product.id,
              productName: product.name,
              quantity: qty,
              price: product.price,
            },
          ],
          totalAmount: total,
          status: "yangi_mijoz",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Buyurtmani saqlab bo'lmadi");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 0 0",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxWidth: 560,
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "28px 28px 40px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: "var(--border-strong)", borderRadius: 4, margin: "0 auto 20px" }} />

        {step === "done" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
              {t("om_done_title")}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
              {t("om_done_desc")}
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 12,
                display: "block",
                width: "100%",
                padding: "13px",
                borderRadius: 20,
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
              }}
            >
              {t("om_close")}
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("om_order_title")}
                </p>
                <h2 style={{ fontFamily: "var(--font-jakarta)", fontSize: 20, fontWeight: 800, color: "var(--fg)" }}>
                  {product.name}
                </h2>
                <p style={{ color: "var(--accent)", fontWeight: 700, fontSize: 15, marginTop: 2 }}>
                  {product.price.toLocaleString()} so&apos;m / {product.unit}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "var(--muted)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Step tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {["info", "map", "confirm"].map((s, i) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 4,
                    background: ["info", "map", "confirm"].indexOf(step) >= i
                      ? "var(--accent)"
                      : "var(--border-strong)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>

            {step === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Customer type */}
                {!user && (
                  <div>
                    <label style={labelStyle}>{t("om_customer_type")}</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["individual", t("om_type_individual")], ["shop", t("om_type_shop")]].map(([val, lbl]) => (
                        <button
                          key={val}
                          onClick={() => setCustomerType(val as "individual" | "shop")}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: 12,
                            border: `2px solid ${customerType === val ? "var(--accent)" : "var(--border)"}`,
                            background: customerType === val ? "var(--accent-bg)" : "var(--surface-2)",
                            color: customerType === val ? "var(--accent-text)" : "var(--muted)",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!user && (
                  <>
                    <div>
                      <label style={labelStyle}>{t("om_name")}</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("om_name_ph")}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("om_phone")}</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 90 000 00 00"
                        style={inputStyle}
                      />
                    </div>
                  </>
                )}

                {/* Quantity */}
                <div>
                  <label style={labelStyle}>{t("om_qty")} ({product.unit})</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setQty(Math.max(product.minOrder ?? 1, (qty ?? 1) - 1))}
                      style={qtyBtnStyle}
                    >
                      −
                    </button>
                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--fg)", minWidth: 32, textAlign: "center" }}>
                      {qty}
                    </span>
                    <button onClick={() => setQty((qty ?? 1) + 1)} style={qtyBtnStyle}>+</button>
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>{product.unit}</span>
                  </div>
                </div>

                {/* Total */}
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: "var(--accent-bg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>{t("om_total")}</span>
                  <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: 18 }}>
                    {total.toLocaleString()} so&apos;m
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!user && (!name || !phone)) return;
                    setStep("map");
                  }}
                  style={primaryBtnStyle}
                >
                  {t("om_continue")}
                </button>
              </div>
            )}

            {step === "map" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t("om_address_title")}</label>
                  <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 10 }}>
                    {t("om_address_desc")}
                  </p>
                  <LocationMap
                    onSelect={(lat, lng, address) => setLocation({ lat, lng, address })}
                    selected={location}
                  />
                </div>

                {location && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    📍 {location.address.slice(0, 80)}...
                  </div>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setStep("info")}
                    style={{ ...primaryBtnStyle, background: "var(--surface-2)", color: "var(--fg)", flex: 1 }}
                  >
                    {t("om_back")}
                  </button>
                  <button
                    onClick={() => location && setStep("confirm")}
                    disabled={!location}
                    style={{ ...primaryBtnStyle, flex: 2, opacity: location ? 1 : 0.4 }}
                  >
                    {t("om_confirm")}
                  </button>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>
                  {t("om_confirm_title")}
                </h3>

                {[
                  [t("om_product"), product.name],
                  [t("om_qty"), `${qty} ${product.unit}`],
                  [t("om_amount"), `${total.toLocaleString()} so'm`],
                  [t("om_name"), name || user?.name || "—"],
                  [t("om_phone"), phone || user?.phone || "—"],
                  [t("om_address_label"), location?.address?.slice(0, 60) + "..." || "—"],
                ].map(([lbl, val]) => (
                  <div
                    key={lbl}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>{lbl}</span>
                    <span style={{ color: "var(--fg)", fontSize: 14, fontWeight: 600, maxWidth: "60%", textAlign: "right" }}>{val}</span>
                  </div>
                ))}

                {error && (
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "var(--red)", fontSize: 13 }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    onClick={() => setStep("map")}
                    style={{ ...primaryBtnStyle, background: "var(--surface-2)", color: "var(--fg)", flex: 1 }}
                  >
                    {t("om_back")}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ ...primaryBtnStyle, flex: 2, opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting ? t("om_submitting") : t("om_submit")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--muted)",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 12,
  border: "1px solid var(--border-strong)",
  background: "var(--surface-2)",
  padding: "0 16px",
  fontSize: 15,
  color: "var(--fg)",
  outline: "none",
};

const qtyBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  border: "1px solid var(--border-strong)",
  background: "var(--surface-2)",
  cursor: "pointer",
  fontSize: 18,
  color: "var(--fg)",
  display: "grid",
  placeItems: "center",
  fontWeight: 700,
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: 20,
  background: "var(--accent)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
};
