"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PAYMENT_CARD, type Product } from "@/lib/data";
import { priceFor } from "@/lib/pricing";
import { useLanguage } from "@/lib/i18n";
import { CheckCircleIcon, CloseIcon, MapPinIcon, CashIcon, CardIcon, CheckIcon, ReceiptIcon, AlertIcon, ArrowRightIcon, ArrowLeftIcon, CopyIcon, UserIcon, StoreIcon } from "./Icons";

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
  const [step, setStep] = useState<"info" | "map" | "payment" | "confirm" | "done">("info");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; preview: string } | null>(null);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptError, setReceiptError] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Logged-in customers get their account's price list; guests pick a type.
  const unitPrice = priceFor(product, user?.type || customerType);
  const total = unitPrice * (qty ?? 1);
  const paymentReady = paymentMethod === "cash" || (paymentMethod === "card" && !!receipt && !receiptUploading);

  async function handleReceiptFile(file: File | undefined) {
    if (!file) return;
    setReceiptError("");
    if (!file.type.startsWith("image/")) {
      setReceiptError(t("pay_receipt_type_err"));
      return;
    }
    setReceiptUploading(true);
    try {
      const blob = await compressImage(file);
      const fd = new FormData();
      fd.append("file", blob, "receipt.jpg");
      const res = await fetch("/api/receipts", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || t("pay_receipt_err"));
      setReceipt({ id: data.receiptId, preview: URL.createObjectURL(blob) });
    } catch (err) {
      setReceipt(null);
      setReceiptError(err instanceof Error ? err.message : t("pay_receipt_err"));
    } finally {
      setReceiptUploading(false);
    }
  }

  function copyCard() {
    navigator.clipboard
      ?.writeText(PAYMENT_CARD.number.replace(/\s/g, ""))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

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
          paymentMethod,
          receiptId: paymentMethod === "card" ? receipt?.id : undefined,
          products: [
            {
              productId: product.id,
              productName: product.name,
              quantity: qty,
              price: unitPrice,
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
            <div className="ok-badge"><CheckCircleIcon size={44} /></div>
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
                  {unitPrice.toLocaleString()} so&apos;m / {product.unit}
                  {(user?.type || customerType) === "shop" && (
                    <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12 }}> · {t("pay_shop_price")}</span>
                  )}
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
                aria-label="Yopish"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {/* Step tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 4,
                    background: (STEPS as readonly string[]).indexOf(step) >= i
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
                    <MapPinIcon size={15} color="var(--accent)" /> {location.address.slice(0, 80)}...
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
                    onClick={() => location && setStep("payment")}
                    disabled={!location}
                    style={{ ...primaryBtnStyle, flex: 2, opacity: location ? 1 : 0.4 }}
                  >
                    {t("om_confirm")}
                  </button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t("pay_title")}</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {([
                      ["cash", t("pay_cash"), t("pay_cash_desc"), CashIcon],
                      ["card", t("pay_card"), t("pay_card_desc"), CardIcon],
                    ] as const).map(([val, lbl, desc, Icon]) => {
                      const active = paymentMethod === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPaymentMethod(val)}
                          aria-pressed={active}
                          style={{
                            textAlign: "left",
                            padding: "14px",
                            borderRadius: 16,
                            border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                            background: active ? "var(--accent-bg)" : "var(--surface-2)",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <span className="pay-ico" style={{ background: active ? "var(--brand-red)" : "var(--surface)", color: active ? "#fff" : "var(--accent)" }}><Icon size={20} /></span>
                          <span style={{ fontWeight: 800, fontSize: 15, color: active ? "var(--accent-text)" : "var(--fg)" }}>{lbl}</span>
                          <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.35 }}>{desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <>
                    {/* Card to transfer to */}
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 18,
                        padding: "18px 20px",
                        color: "#fff6ea",
                        background: "linear-gradient(135deg, #e2231a 0%, #b3140d 55%, #5b2a14 100%)",
                        boxShadow: "0 12px 30px rgba(91,42,20,0.25)",
                        overflow: "hidden",
                      }}
                    >
                      {PAYMENT_CARD.isDemo && (
                        <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: 999, background: "#ffc72c", color: "#3b1a0b" }}>
                          DEMO
                        </span>
                      )}
                      <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 14 }}>{PAYMENT_CARD.bank}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums" }}>
                          {PAYMENT_CARD.number}
                        </span>
                        <button
                          type="button"
                          onClick={copyCard}
                          style={{ padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(255,246,234,0.5)", background: "rgba(255,246,234,0.15)", color: "#fff6ea", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                        >
                          {copied ? <CheckIcon size={13} strokeWidth={3} /> : <CopyIcon size={13} />} {copied ? t("pay_copied") : t("pay_copy")}
                        </button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12.5, gap: 10 }}>
                        <span style={{ opacity: 0.9 }}>{PAYMENT_CARD.holder}</span>
                        <span style={{ fontWeight: 800 }}>{total.toLocaleString()} so&apos;m</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginTop: -6 }}>
                      {t("pay_card_hint")}
                    </p>

                    {/* Receipt upload */}
                    <div>
                      <label style={labelStyle}>{t("pay_receipt")}</label>
                      <label
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          minHeight: 130,
                          padding: 14,
                          borderRadius: 16,
                          border: `2px dashed ${receipt ? "var(--green)" : receiptError ? "var(--red)" : "var(--border-strong)"}`,
                          background: "var(--surface-2)",
                          cursor: receiptUploading ? "wait" : "pointer",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          disabled={receiptUploading}
                          onChange={(e) => { handleReceiptFile(e.target.files?.[0]); e.target.value = ""; }}
                          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                        />
                        {receiptUploading ? (
                          <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{t("pay_receipt_uploading")}</span>
                        ) : receipt ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={receipt.preview} alt={t("pay_receipt")} style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 10, objectFit: "contain" }} />
                            <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}><CheckIcon size={14} strokeWidth={3} /> {t("pay_receipt_done")}</span>
                            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{t("pay_receipt_change")}</span>
                          </>
                        ) : (
                          <>
                            <span className="pay-ico" style={{ width: 52, height: 52, color: "var(--accent)", background: "var(--surface)" }}><ReceiptIcon size={24} /></span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{t("pay_receipt_cta")}</span>
                            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>JPG, PNG, WEBP</span>
                          </>
                        )}
                      </label>
                      {receiptError && (
                        <p style={{ color: "var(--red)", fontSize: 12.5, marginTop: 6 }}><AlertIcon size={14} /> {receiptError}</p>
                      )}
                    </div>
                  </>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setStep("map")}
                    style={{ ...primaryBtnStyle, background: "var(--surface-2)", color: "var(--fg)", flex: 1 }}
                  >
                    {t("om_back")}
                  </button>
                  <button
                    onClick={() => paymentReady && setStep("confirm")}
                    disabled={!paymentReady}
                    style={{ ...primaryBtnStyle, flex: 2, opacity: paymentReady ? 1 : 0.4 }}
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
                  [t("pay_title"), paymentMethod === "card" ? `${t("pay_card")} · ${t("pay_receipt_done")}` : t("pay_cash")],
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
                    <AlertIcon size={15} /> {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    onClick={() => setStep("payment")}
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

const STEPS = ["info", "map", "payment", "confirm"] as const;

// Downscale phone screenshots/photos before upload so receipts stay small.
async function compressImage(file: File): Promise<Blob> {
  const MAX = 1600;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // format the browser can't decode — the server will reject it
  }
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const q of [0.82, 0.65, 0.5]) {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", q));
    if (blob && blob.size <= 2.5 * 1024 * 1024) return blob;
  }
  return file;
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
