"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useLanguage, type TranslationKey } from "@/lib/i18n";
import {
  ClipboardCheckIcon, CardIcon, TruckIcon, HomeCheckIcon, CheckIcon, UserIcon, StoreIcon,
  PhoneIcon, CashIcon, ReceiptIcon, CookieIcon, LogoutIcon, ArrowRightIcon, ChevronDownIcon,
  AlertIcon, CheckCircleIcon, BoxIcon,
} from "@/components/Icons";

type OrderStatus = "yangi_mijoz" | "tolov_otkazildi" | "yetkazib_berishda" | "yetkazib_berildi";
type Tab = "orders" | "info";

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
  createdAt: string;
}

// Customer-facing names of the admin kanban stages, in order.
const STAGES: { id: OrderStatus; label: TranslationKey; Icon: typeof TruckIcon }[] = [
  { id: "yangi_mijoz", label: "pf_st_new", Icon: ClipboardCheckIcon },
  { id: "tolov_otkazildi", label: "pf_st_paid", Icon: CardIcon },
  { id: "yetkazib_berishda", label: "pf_st_delivering", Icon: TruckIcon },
  { id: "yetkazib_berildi", label: "pf_st_delivered", Icon: HomeCheckIcon },
];

const REFRESH_MS = 30_000;
const samePhone = (a: string, b: string) => a.replace(/\s/g, "") === b.replace(/\s/g, "");

export default function ProfilePage() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProfileInner />
    </Suspense>
  );
}

function ProfileInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useLanguage();
  const tab: Tab = params.get("tab") === "info" ? "info" : "orders";
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

    // statuses are changed from the admin panel — keep them fresh
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

      {/* Header with tabs */}
      <section className="pf-head">
        <div className="pf-wrap">
          <div className="pf-head-inner">
            <div className="pf-avatar">{profile.name.charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="pf-kicker">{t("pf_title")}</p>
              <h1 className="pf-name">{profile.name}</h1>
              <div className="pf-chips">
                <span className="pf-chip">
                  {profile.type === "shop" ? <StoreIcon size={14} /> : <UserIcon size={14} />}
                  {profile.type === "shop" ? t("pf_type_shop") : t("pf_type_individual")}
                </span>
                <span className="pf-chip"><PhoneIcon size={14} /> {profile.phone}</span>
                {profile.type === "shop" && profile.shopName && (
                  <span className="pf-chip"><StoreIcon size={14} /> {profile.shopName}</span>
                )}
              </div>
            </div>
            <button onClick={logout} className="pf-logout">
              <LogoutIcon size={17} /> {t("nav_logout")}
            </button>
          </div>

          <div className="pf-tabs" role="tablist">
            <Link
              href="/profile"
              role="tab"
              aria-selected={tab === "orders"}
              className={`pf-tab ${tab === "orders" ? "is-active" : ""}`}
              scroll={false}
            >
              <BoxIcon size={17} /> {t("pf_orders")}
              {orders.length > 0 && <span className="pf-tab-count">{orders.length}</span>}
            </Link>
            <Link
              href="/profile?tab=info"
              role="tab"
              aria-selected={tab === "info"}
              className={`pf-tab ${tab === "info" ? "is-active" : ""}`}
              scroll={false}
            >
              <UserIcon size={17} /> {t("pf_info")}
            </Link>
          </div>
        </div>
      </section>

      <div className="pf-wrap pf-body">
        {tab === "orders" ? (
          <section>
            <div className="pf-section-head">
              <h2 className="pf-card-title">{t("pf_orders")}</h2>
              {orders.length > 0 && (
                <span className="pf-meta">
                  {t("pf_orders_count").replace("{n}", String(orders.length)).replace("{a}", String(activeCount))}
                </span>
              )}
            </div>

            {ordersLoading ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>{t("pf_loading")}</p>
            ) : orders.length === 0 ? (
              <div className="pf-card pf-empty">
                <span className="pf-empty-ico"><CookieIcon size={40} /></span>
                <p>{t("pf_no_orders")}</p>
                <Link href="/#mahsulotlar" className="btn btn-red btn-sm">
                  {t("pf_go_shop")} <ArrowRightIcon size={16} className="arrow-ico" />
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orders.map((o) => (
                  <OrderCard key={o._id} order={o} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <AccountForm profile={profile} onSaved={setProfile} />
        )}
      </div>

      <style>{`
        .pf-wrap { max-width: 880px; margin: 0 auto; padding: 0 20px; }
        .pf-head { background: var(--brand-red); color: var(--brand-cream); padding-top: 30px; }
        .pf-head-inner { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding-bottom: 22px; }
        .pf-avatar {
          width: 76px; height: 76px; border-radius: 50%; flex-shrink: 0;
          background: var(--brand-yellow); color: var(--brand-choco-deep);
          display: grid; place-items: center; font-family: var(--font-display); font-size: 36px; font-weight: 800;
          box-shadow: 0 5px 0 var(--brand-yellow-deep);
        }
        .pf-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.8; }
        .pf-name { font-family: var(--font-display); font-weight: 800; font-size: clamp(26px, 4vw, 38px); line-height: 1.05; }
        .pf-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
        .pf-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 999px; background: rgba(255,246,234,0.16); white-space: nowrap; }
        .pf-logout {
          display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 999px;
          border: 2px solid rgba(255,246,234,0.6); background: transparent; color: var(--brand-cream);
          font-weight: 700; font-size: 14px; cursor: pointer; font-family: var(--font-dm);
        }
        .pf-logout:hover { background: rgba(255,246,234,0.14); }

        .pf-tabs { display: flex; gap: 6px; }
        .pf-tab {
          display: inline-flex; align-items: center; gap: 8px; padding: 13px 20px; border-radius: 18px 18px 0 0;
          color: var(--brand-cream); font-weight: 700; font-size: 15px; text-decoration: none; opacity: 0.85;
        }
        .pf-tab:hover { opacity: 1; background: rgba(255,246,234,0.1); }
        .pf-tab.is-active { background: var(--bg); color: var(--accent); opacity: 1; }
        .pf-tab-count {
          min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px; font-size: 12px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--brand-yellow); color: var(--brand-choco-deep);
        }

        .pf-body { padding-top: 26px; padding-bottom: 72px; }
        .pf-section-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .pf-meta { font-size: 13px; color: var(--muted); }
        .pf-card { background: var(--surface); border: 1px solid var(--border); border-radius: 26px; padding: 24px; box-shadow: var(--shadow); }
        .pf-card-title { font-family: var(--font-display); font-weight: 800; font-size: 26px; color: var(--accent); }
        .pf-empty { text-align: center; padding: 40px 20px; }
        .pf-empty p { color: var(--muted); margin: 12px 0 18px; }
        .pf-empty-ico { display: inline-flex; width: 76px; height: 76px; border-radius: 50%; align-items: center; justify-content: center; background: var(--accent-bg); color: var(--accent); }

        .pf-form { max-width: 560px; display: flex; flex-direction: column; gap: 16px; }
        .pf-group { display: flex; flex-direction: column; gap: 14px; }
        .pf-divider { height: 1px; background: var(--border); margin: 4px 0; }
        .pf-label { display: block; font-size: 12px; font-weight: 700; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
        .pf-input {
          width: 100%; height: 48px; border-radius: 14px; border: 1px solid var(--border-strong);
          background: var(--surface-2); padding: 0 14px; font-size: 15px; color: var(--fg); outline: none;
          font-family: var(--font-dm);
        }
        .pf-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
        .pf-hint { font-size: 12.5px; color: var(--muted); margin-top: 6px; line-height: 1.45; }
        .pf-toggle {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          padding: 13px 14px; border-radius: 14px; border: 1px dashed var(--border-strong);
          background: transparent; color: var(--accent); font-weight: 700; font-size: 14px; cursor: pointer;
          font-family: var(--font-dm);
        }
        .pf-toggle svg { transition: transform 0.2s; }
        .pf-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
        .pf-msg { display: flex; align-items: center; gap: 8px; font-size: 13.5px; padding: 11px 13px; border-radius: 12px; font-weight: 600; }
        .pf-msg.ok { background: rgba(22,163,74,0.1); color: var(--green); }
        .pf-msg.err { background: rgba(220,38,38,0.1); color: var(--red); }

        .ord { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 20px; box-shadow: var(--shadow); }
        .ord-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
        .ord-status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; padding: 7px 13px; border-radius: 999px; }
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); position: relative; margin-bottom: 18px; }
        .step { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; position: relative; z-index: 1; }
        .step-dot {
          width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center;
          background: var(--surface); border: 2px solid var(--border-strong); color: var(--muted-2);
        }
        .step.done .step-dot { background: var(--brand-red); border-color: var(--brand-red); color: #fff; }
        .step.current .step-dot { background: var(--surface); border-color: var(--brand-red); color: var(--brand-red); box-shadow: 0 0 0 5px var(--accent-bg); }
        .step span { font-size: 12px; font-weight: 700; color: var(--muted); line-height: 1.25; }
        .step.done span, .step.current span { color: var(--fg); }
        .steps-line { position: absolute; top: 20px; left: 12.5%; right: 12.5%; height: 4px; border-radius: 4px; background: var(--border-strong); }
        .steps-line i { display: block; height: 100%; border-radius: 4px; background: var(--brand-red); transition: width 0.4s; }
        .ord-items { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 16px; background: var(--surface-2); }
        .ord-item { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; }
        .ord-foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 14px; font-size: 13.5px; color: var(--muted); }
        .ord-pay { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; }

        @media (max-width: 560px) {
          .pf-wrap { padding: 0 16px; }
          .pf-head { padding-top: 22px; }
          .pf-avatar { width: 58px; height: 58px; font-size: 26px; }
          .pf-logout { width: 100%; justify-content: center; }
          .pf-tab { flex: 1; justify-content: center; padding: 12px 8px; font-size: 14px; }
          .pf-card, .ord { padding: 16px; border-radius: 22px; }
          .step-dot { width: 34px; height: 34px; }
          .step-dot svg { width: 16px; height: 16px; }
          .steps-line { top: 16px; }
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
          <div style={{ fontWeight: 800, color: "var(--fg)", fontSize: 16 }}>
            {t("pf_order")} #{order._id.slice(-6).toUpperCase()}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{date}</div>
        </div>
        <span
          className="ord-status"
          style={{
            background: delivered ? "rgba(22,163,74,0.12)" : "var(--accent-bg)",
            color: delivered ? "var(--green)" : "var(--accent-text)",
          }}
        >
          <stage.Icon size={15} /> {t(stage.label)}
        </span>
      </div>

      <div className="steps" role="list" aria-label={t("pf_status")}>
        <div className="steps-line" aria-hidden="true">
          <i style={{ width: `${(idx / (STAGES.length - 1)) * 100}%` }} />
        </div>
        {STAGES.map((s, i) => {
          const done = i < idx || (delivered && i === idx);
          const current = i === idx && !delivered;
          return (
            <div key={s.id} role="listitem" aria-current={current ? "step" : undefined} className={`step ${done ? "done" : ""} ${current ? "current" : ""}`}>
              <div className="step-dot">{done ? <CheckIcon size={18} strokeWidth={3} /> : <s.Icon size={19} />}</div>
              <span>{t(s.label)}</span>
            </div>
          );
        })}
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
        <span className="ord-pay">
          {order.paymentMethod === "card" ? (
            <><CardIcon size={17} /> {t("pay_card")}{order.receiptId && <><ReceiptIcon size={15} /> {t("pay_receipt_done")}</>}</>
          ) : order.paymentMethod === "cash" ? (
            <><CashIcon size={17} /> {t("pay_cash")}</>
          ) : null}
        </span>
        <span style={{ fontSize: 15 }}>
          {t("om_total")}: <b style={{ color: "var(--accent)", fontSize: 18 }}>{order.totalAmount.toLocaleString()} so&apos;m</b>
        </span>
      </div>
    </article>
  );
}

/** Name / phone / shop name + optional password change, saved with one button. */
function AccountForm({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const { t } = useLanguage();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [shopName, setShopName] = useState(profile.shopName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [changePw, setChangePw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const phoneChanged = !samePhone(phone, profile.phone);
  const infoChanged =
    name.trim() !== profile.name || phoneChanged || (profile.type === "shop" && shopName.trim() !== (profile.shopName || ""));
  const wantsPw = changePw && (newPw.length > 0 || confirmPw.length > 0);
  const needsCurrent = phoneChanged || wantsPw;
  const canSave = (infoChanged || wantsPw) && (!needsCurrent || currentPassword.length > 0) && !saving;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (wantsPw) {
      if (newPw.length < 6) return setMsg({ ok: false, text: t("pf_pw_short") });
      if (newPw !== confirmPw) return setMsg({ ok: false, text: t("pf_pw_mismatch") });
    }
    setSaving(true);
    try {
      if (infoChanged) {
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
        localStorage.setItem("pecheniya_user", JSON.stringify(data.user));
      }
      if (wantsPw) {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword: newPw }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setNewPw("");
        setConfirmPw("");
        setChangePw(false);
      }
      setCurrentPassword("");
      setMsg({ ok: true, text: wantsPw ? t("pf_pw_changed") : t("pf_saved") });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : t("pf_error") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="pf-card pf-form" onSubmit={save}>
      <h2 className="pf-card-title">{t("pf_info")}</h2>

      <div className="pf-group">
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
      </div>

      <div className="pf-divider" />

      <div className="pf-group">
        <div>
          <label className="pf-label" htmlFor="pf-cur">{t("pf_current_password")}</label>
          <input
            id="pf-cur"
            className="pf-input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
          <p className="pf-hint">{t("pf_current_hint")}</p>
        </div>

        <button
          type="button"
          className="pf-toggle"
          aria-expanded={changePw}
          aria-controls="pf-newpw"
          onClick={() => setChangePw((v) => !v)}
        >
          {t("pf_password")}
          <ChevronDownIcon size={18} />
        </button>

        {changePw && (
          <div id="pf-newpw" className="pf-group">
            <div>
              <label className="pf-label" htmlFor="pw-new">{t("pf_new_password")}</label>
              <input id="pw-new" className="pf-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" />
            </div>
            <div>
              <label className="pf-label" htmlFor="pw-conf">{t("pf_confirm_password")}</label>
              <input id="pw-conf" className="pf-input" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} autoComplete="new-password" />
            </div>
          </div>
        )}
      </div>

      {msg && (
        <div className={`pf-msg ${msg.ok ? "ok" : "err"}`} role="status">
          {msg.ok ? <CheckCircleIcon size={18} /> : <AlertIcon size={18} />} {msg.text}
        </div>
      )}

      <button type="submit" className="btn btn-red" disabled={!canSave} style={{ opacity: canSave ? 1 : 0.5 }}>
        {saving ? t("pf_saving") : t("pf_save")}
      </button>
    </form>
  );
}
