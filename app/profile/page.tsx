"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useLanguage, type TranslationKey } from "@/lib/i18n";

type OrderStatus = "yangi_mijoz" | "tolov_otkazildi" | "yetkazib_berishda" | "yetkazib_berildi";

interface Profile {
  id: string;
  name: string;
  phone: string;
  type: "individual" | "shop" | "admin";
  shopName?: string;
  createdAt?: string;
}

interface Order {
  _id: string;
  products: { productId: string; productName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: "cash" | "card" | "online";
  receiptId?: string;
  customerAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

// Customer-facing names of the admin kanban stages, in order.
const STAGES: { id: OrderStatus; label: TranslationKey; icon: string }[] = [
  { id: "yangi_mijoz", label: "pf_st_new", icon: "📝" },
  { id: "tolov_otkazildi", label: "pf_st_paid", icon: "💳" },
  { id: "yetkazib_berishda", label: "pf_st_delivering", icon: "🚚" },
  { id: "yetkazib_berildi", label: "pf_st_delivered", icon: "🎉" },
];

const REFRESH_MS = 30_000;

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.status === 401) return;
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {
      /* keep previous list */
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.status === 401) {
          localStorage.removeItem("pecheniya_user");
          router.replace("/auth/login?redirect=/profile");
          return;
        }
        const data = await res.json();
        if (data.success) setProfile(data.user);
      } finally {
        setLoading(false);
      }
    })();
    loadOrders();

    // statuses change in the admin panel — keep them fresh
    const id = setInterval(loadOrders, REFRESH_MS);
    const onFocus = () => loadOrders();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [router, loadOrders]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("pecheniya_user");
    router.push("/");
  }

  if (loading || !profile) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Navbar />
        <div style={{ padding: 80, textAlign: "center", color: "var(--muted)" }}>{t("pf_loading")}</div>
      </div>
    );
  }

  const activeCount = orders.filter((o) => o.status !== "yetkazib_berildi").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Header */}
      <section className="pf-head">
        <div className="wrap pf-head-inner">
          <div className="pf-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="pf-kicker">{t("pf_title")}</p>
            <h1 className="pf-name">{profile.name}</h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span className="pf-chip">{profile.type === "shop" ? `🏪 ${t("pf_type_shop")}` : `👤 ${t("pf_type_individual")}`}</span>
              <span className="pf-chip">📞 {profile.phone}</span>
              {profile.type === "shop" && profile.shopName && <span className="pf-chip">{profile.shopName}</span>}
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost-light btn-sm">{t("nav_logout")}</button>
        </div>
      </section>

      <div className="wrap pf-grid">
        {/* Left: account */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <InfoCard profile={profile} onSaved={setProfile} />
          <PasswordCard />
        </div>

        {/* Right: orders */}
        <section className="pf-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <h2 className="pf-card-title">{t("pf_orders")}</h2>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              {t("pf_orders_count").replace("{n}", String(orders.length)).replace("{a}", String(activeCount))}
            </span>
          </div>

          {ordersLoading ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("pf_loading")}</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 10px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🍪</div>
              <p style={{ color: "var(--muted)", marginBottom: 18 }}>{t("pf_no_orders")}</p>
              <Link href="/#mahsulotlar" className="btn btn-red btn-sm">{t("pf_go_shop")} →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map((o) => (
                <OrderCard key={o._id} order={o} />
              ))}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .pf-head { background: var(--brand-red); color: var(--brand-cream); padding: 34px 0 70px; }
        .pf-head-inner { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .pf-avatar {
          width: 84px; height: 84px; border-radius: 50%; flex-shrink: 0;
          background: var(--brand-yellow); color: var(--brand-choco-deep);
          display: grid; place-items: center; font-family: var(--font-display); font-size: 40px;
          box-shadow: 0 6px 0 var(--brand-yellow-deep);
        }
        .pf-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.8; }
        .pf-name { font-family: var(--font-display); font-weight: 800; font-size: clamp(28px, 4vw, 42px); line-height: 1.05; }
        .pf-chip { font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 999px; background: rgba(255,246,234,0.16); }
        .pf-grid {
          display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 20px;
          margin-top: -44px; padding-bottom: 72px; align-items: start;
        }
        .pf-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: 26px;
          padding: 22px; box-shadow: var(--shadow);
        }
        .pf-card-title { font-family: var(--font-display); font-weight: 800; font-size: 24px; color: var(--accent); }
        .pf-label { display: block; font-size: 12px; font-weight: 700; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
        .pf-input {
          width: 100%; height: 46px; border-radius: 14px; border: 1px solid var(--border-strong);
          background: var(--surface-2); padding: 0 14px; font-size: 15px; color: var(--fg); outline: none;
          font-family: var(--font-dm);
        }
        .pf-input:focus { border-color: var(--accent); }
        .pf-input:disabled { opacity: 0.6; }
        .pf-msg { font-size: 13px; padding: 10px 12px; border-radius: 12px; }
        .pf-msg.ok { background: rgba(22,163,74,0.1); color: var(--green); }
        .pf-msg.err { background: rgba(220,38,38,0.1); color: var(--red); }

        .ord { border: 1px solid var(--border); border-radius: 20px; padding: 16px; background: var(--bg); }
        .ord-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .ord-status { font-size: 12.5px; font-weight: 800; padding: 6px 12px; border-radius: 999px; }
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); position: relative; margin-bottom: 16px; }
        .step { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; position: relative; z-index: 1; }
        .step-dot {
          width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-size: 17px;
          background: var(--surface-2); border: 2px solid var(--border-strong); filter: grayscale(1); opacity: 0.6;
        }
        .step.done .step-dot { background: var(--accent-bg); border-color: var(--accent); filter: none; opacity: 1; }
        .step.current .step-dot { background: var(--brand-red); border-color: var(--brand-red); box-shadow: 0 0 0 5px var(--accent-bg); filter: none; opacity: 1; }
        .step span { font-size: 11.5px; font-weight: 700; color: var(--muted); line-height: 1.2; }
        .step.done span, .step.current span { color: var(--fg); }
        .steps-line { position: absolute; top: 18px; left: 12.5%; right: 12.5%; height: 4px; border-radius: 4px; background: var(--border-strong); }
        .steps-line i { display: block; height: 100%; border-radius: 4px; background: var(--brand-red); transition: width 0.4s; }
        .ord-items { display: flex; flex-direction: column; gap: 6px; padding: 12px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); }
        .ord-item { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; }
        .ord-foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; color: var(--muted); }

        @media (max-width: 900px) {
          .pf-grid { grid-template-columns: 1fr; }
        }
        .pf-chip { white-space: nowrap; }
        @media (max-width: 520px) {
          .pf-head { padding: 24px 0 64px; }
          .pf-head-inner { gap: 14px; }
          .pf-avatar { width: 60px; height: 60px; font-size: 28px; }
          .pf-head-inner > .btn { width: 100%; }
          .pf-card { padding: 16px; border-radius: 22px; }
          .step-dot { width: 32px; height: 32px; font-size: 14px; }
          .steps-line { top: 15px; }
          .step span { font-size: 10.5px; }
        }
      `}</style>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { t } = useLanguage();
  const idx = Math.max(0, STAGES.findIndex((s) => s.id === order.status));
  const stage = STAGES[idx];
  const delivered = order.status === "yetkazib_berildi";
  const d = new Date(order.createdAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;

  return (
    <article className="ord">
      <div className="ord-top">
        <div>
          <div style={{ fontWeight: 800, color: "var(--fg)", fontSize: 15 }}>
            {t("pf_order")} #{order._id.slice(-6).toUpperCase()}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{date}</div>
        </div>
        <span
          className="ord-status"
          style={{
            background: delivered ? "rgba(22,163,74,0.12)" : "var(--accent-bg)",
            color: delivered ? "var(--green)" : "var(--accent-text)",
          }}
        >
          {stage.icon} {t(stage.label)}
        </span>
      </div>

      <div className="steps" role="list" aria-label={t("pf_status")}>
        <div className="steps-line" aria-hidden="true">
          <i style={{ width: `${(idx / (STAGES.length - 1)) * 100}%` }} />
        </div>
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            role="listitem"
            aria-current={i === idx ? "step" : undefined}
            className={`step ${i < idx || (delivered && i === idx) ? "done" : ""} ${i === idx && !delivered ? "current" : ""}`}
          >
            <div className="step-dot">{i < idx || delivered ? "✓" : s.icon}</div>
            <span>{t(s.label)}</span>
          </div>
        ))}
      </div>

      <div className="ord-items">
        {order.products.map((p, i) => (
          <div key={i} className="ord-item">
            <span style={{ color: "var(--fg)" }}>
              {p.productName} <span style={{ color: "var(--muted)" }}>× {p.quantity}</span>
            </span>
            <span style={{ fontWeight: 700, color: "var(--fg)", whiteSpace: "nowrap" }}>
              {(p.price * p.quantity).toLocaleString()} so&apos;m
            </span>
          </div>
        ))}
      </div>

      <div className="ord-foot">
        <span>
          {order.paymentMethod === "card"
            ? `💳 ${t("pay_card")}${order.receiptId ? ` · ${t("pay_receipt_done")}` : ""}`
            : order.paymentMethod === "cash"
              ? `💵 ${t("pay_cash")}`
              : ""}
        </span>
        <span style={{ fontSize: 15 }}>
          {t("om_total")}: <b style={{ color: "var(--accent)", fontSize: 17 }}>{order.totalAmount.toLocaleString()} so&apos;m</b>
        </span>
      </div>
    </article>
  );
}

function InfoCard({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const { t } = useLanguage();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [shopName, setShopName] = useState(profile.shopName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const phoneChanged = phone.replace(/\s/g, "") !== profile.phone;
  const dirty = name.trim() !== profile.name || phoneChanged || (profile.type === "shop" && shopName.trim() !== (profile.shopName || ""));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          ...(profile.type === "shop" ? { shopName } : {}),
          ...(phoneChanged ? { currentPassword } : {}),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSaved(data.user);
      setPhone(data.user.phone);
      setCurrentPassword("");
      // keep the navbar / order form in sync
      localStorage.setItem("pecheniya_user", JSON.stringify(data.user));
      setMsg({ ok: true, text: t("pf_saved") });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : t("pf_error") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="pf-card" onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="pf-card-title">{t("pf_info")}</h2>
      <div>
        <label className="pf-label" htmlFor="pf-name">{t("om_name")}</label>
        <input id="pf-name" className="pf-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </div>
      <div>
        <label className="pf-label" htmlFor="pf-phone">{t("om_phone")}</label>
        <input id="pf-phone" className="pf-input" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="+998901234567" />
      </div>
      {profile.type === "shop" && (
        <div>
          <label className="pf-label" htmlFor="pf-shop">{t("pf_shop_name")}</label>
          <input id="pf-shop" className="pf-input" value={shopName} onChange={(e) => setShopName(e.target.value)} />
        </div>
      )}
      {phoneChanged && (
        <div>
          <label className="pf-label" htmlFor="pf-cur">{t("pf_current_password")}</label>
          <input id="pf-cur" className="pf-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{t("pf_phone_hint")}</p>
        </div>
      )}
      {msg && <div className={`pf-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      <button type="submit" className="btn btn-red" disabled={!dirty || saving || (phoneChanged && !currentPassword)} style={{ opacity: !dirty || saving ? 0.5 : 1 }}>
        {saving ? t("pf_saving") : t("pf_save")}
      </button>
    </form>
  );
}

function PasswordCard() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 6) return setMsg({ ok: false, text: t("pf_pw_short") });
    if (next !== confirm) return setMsg({ ok: false, text: t("pf_pw_mismatch") });
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setCurrent(""); setNext(""); setConfirm("");
      setMsg({ ok: true, text: t("pf_pw_changed") });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : t("pf_error") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="pf-card" onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="pf-card-title">{t("pf_password")}</h2>
      <div>
        <label className="pf-label" htmlFor="pw-cur">{t("pf_current_password")}</label>
        <input id="pw-cur" className="pf-input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
      </div>
      <div>
        <label className="pf-label" htmlFor="pw-new">{t("pf_new_password")}</label>
        <input id="pw-new" className="pf-input" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
      </div>
      <div>
        <label className="pf-label" htmlFor="pw-conf">{t("pf_confirm_password")}</label>
        <input id="pw-conf" className="pf-input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      </div>
      {msg && <div className={`pf-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
      <button type="submit" className="btn btn-yellow" disabled={saving || !current || !next || !confirm} style={{ opacity: saving || !current || !next || !confirm ? 0.5 : 1 }}>
        {saving ? t("pf_saving") : t("pf_pw_btn")}
      </button>
    </form>
  );
}
