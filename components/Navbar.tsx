"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OPERATOR } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BoxIcon, PhoneIcon, UserIcon, LogoutIcon, MenuIcon, CloseIcon, SunIcon, MoonIcon } from "./Icons";

interface StoredUser {
  name: string;
  phone: string;
  isAdmin?: boolean;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const onProfile = pathname === "/profile";

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("pecheniya_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  function handleLogout() {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("pecheniya_user");
    setUser(null);
    setMobileOpen(false);
    router.push("/");
  }

  const isDark = theme === "dark";
  const themeLabel = isDark ? "Yorug' rejim" : "Qorong'i rejim";
  const telHref = `tel:${OPERATOR.phone.replace(/\s/g, "")}`;

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smag-logo.png" alt="SmaG" />
          <span className="nav-brand-text">PECHENIYA</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links nav-desktop-only">
          <Link href="/#mahsulotlar" className="nav-link">{t("nav_products")}</Link>
          {mounted && user && (
            <Link href="/profile" className="nav-link">{t("nav_orders")}</Link>
          )}
          <a href={telHref} className="nav-phone">
            <PhoneIcon size={15} /> {OPERATOR.phone}
          </a>
        </div>

        {/* Right (desktop) */}
        <div className="nav-actions nav-desktop-only">
          <LanguageSwitcher />

          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="nav-icon-btn"
              aria-label={themeLabel}
              title={themeLabel}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
          )}

          {mounted &&
            (user ? (
              <>
                <Link
                  href="/profile?tab=info"
                  className={`nav-profile ${onProfile ? "is-active" : ""}`}
                  aria-current={onProfile ? "page" : undefined}
                >
                  <span className="nav-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="nav-profile-text">
                    <small>{t("nav_profile")}</small>
                    <b>{user.name}</b>
                  </span>
                </Link>
                <button onClick={handleLogout} className="nav-icon-btn" aria-label={t("nav_logout")} title={t("nav_logout")}>
                  <LogoutIcon size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="nav-login">{t("nav_login")}</Link>
                <Link href="/auth/register" className="btn btn-yellow btn-sm nav-register">{t("nav_register")}</Link>
              </>
            ))}
        </div>

        {/* Mobile: profile shortcut + hamburger */}
        <div className="nav-mobile-only nav-mobile-bar">
          {mounted && user && (
            <Link href="/profile" className="nav-avatar nav-avatar-link" aria-label={t("nav_profile")}>
              {user.name.charAt(0).toUpperCase()}
            </Link>
          )}
          <button
            className="nav-icon-btn nav-burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Menyuni yopish" : "Menyu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="nav-mobile-only nav-mobile-panel">
          <Link href="/#mahsulotlar" onClick={() => setMobileOpen(false)} className="nav-mobile-link">
            {t("nav_products")}
          </Link>
          {mounted && user && (
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="nav-mobile-link">
              <BoxIcon size={18} /> {t("nav_orders")}
            </Link>
          )}
          <a href={telHref} className="nav-mobile-link nav-mobile-phone">
            <PhoneIcon size={17} /> {OPERATOR.phone}
          </a>

          <div className="nav-mobile-row">
            <LanguageSwitcher />
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="nav-icon-btn nav-icon-btn-dark"
                aria-label={themeLabel}
              >
                {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
            )}
          </div>

          {mounted &&
            (user ? (
              <div className="nav-mobile-actions">
                <Link href="/profile?tab=info" onClick={() => setMobileOpen(false)} className="btn btn-yellow">
                  <UserIcon size={18} /> {t("nav_profile")}
                </Link>
                <button onClick={handleLogout} className="nav-mobile-logout">
                  <LogoutIcon size={18} /> {t("nav_logout")}
                </button>
              </div>
            ) : (
              <div className="nav-mobile-actions two">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="nav-mobile-logout" style={{ color: "var(--fg)" }}>
                  {t("nav_login")}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="btn btn-red">
                  {t("nav_register")}
                </Link>
              </div>
            ))}
        </div>
      )}

      <style>{`
        .nav { position: sticky; top: 0; z-index: 50; background: var(--brand-red); box-shadow: 0 2px 0 var(--brand-red-deep); }
        .nav-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 72px; padding: 0 16px; gap: 16px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .nav-logo img { height: 44px; width: auto; border-radius: 8px; }
        .nav-brand-text { font-family: var(--font-display); font-size: 24px; font-weight: 800; color: var(--brand-cream); letter-spacing: 0.02em; }

        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { color: var(--brand-cream); font-size: 14px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.04em; position: relative; padding: 4px 0; }
        .nav-link::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px; border-radius: 2px; background: var(--brand-yellow); transform: scaleX(0); transition: transform 0.2s; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-phone { display: inline-flex; align-items: center; gap: 7px; color: var(--brand-yellow); font-size: 14px; font-weight: 700; text-decoration: none; }

        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .nav-icon-btn {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center; padding: 0;
          border: 1px solid rgba(255,246,234,0.35); background: rgba(255,246,234,0.14);
          color: var(--brand-cream); cursor: pointer; transition: background 0.15s;
        }
        .nav-icon-btn:hover { background: rgba(255,246,234,0.26); }
        .nav-icon-btn:focus-visible, .nav-profile:focus-visible, .nav-login:focus-visible { outline: 3px solid var(--brand-yellow); outline-offset: 2px; }

        .nav-profile {
          display: inline-flex; align-items: center; gap: 10px; padding: 4px 16px 4px 4px; border-radius: 999px;
          background: rgba(255,246,234,0.14); border: 1px solid rgba(255,246,234,0.35);
          color: var(--brand-cream); text-decoration: none; transition: background 0.15s;
        }
        .nav-profile:hover, .nav-profile.is-active { background: var(--brand-cream); color: var(--brand-choco-deep); }
        .nav-profile-text { display: flex; flex-direction: column; line-height: 1.1; max-width: 150px; }
        .nav-profile-text small { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.75; }
        .nav-profile-text b { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nav-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--brand-yellow); color: var(--brand-choco-deep);
          font-family: var(--font-display); font-weight: 800; font-size: 16px; line-height: 1;
        }
        .nav-avatar-link { width: 40px; height: 40px; font-size: 18px; text-decoration: none; box-shadow: 0 3px 0 var(--brand-yellow-deep); }

        .nav-login { color: var(--brand-cream); font-size: 14px; font-weight: 700; text-decoration: none; padding: 9px 18px; border-radius: 999px; border: 2px solid rgba(255,246,234,0.6); }
        .nav-login:hover { background: rgba(255,246,234,0.14); }

        .nav-mobile-bar { align-items: center; gap: 10px; }
        .nav-burger { width: 44px; height: 44px; }

        .nav-mobile-panel { flex-direction: column; gap: 4px; padding: 12px 16px 18px; background: var(--surface); border-top: 1px solid var(--border); box-shadow: 0 16px 30px rgba(59,26,11,0.15); }
        .nav-mobile-link { display: flex; align-items: center; gap: 8px; padding: 12px 4px; color: var(--fg); font-size: 16px; font-weight: 700; text-decoration: none; border-bottom: 1px solid var(--border); }
        .nav-mobile-phone { color: var(--accent); }
        .nav-mobile-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
        .nav-icon-btn-dark { border-color: var(--border-strong); background: var(--surface-2); color: var(--fg); }
        .nav-mobile-actions { display: grid; gap: 10px; }
        .nav-mobile-actions.two { grid-template-columns: 1fr 1fr; }
        .nav-mobile-logout {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; border-radius: 999px; border: 2px solid var(--border-strong); background: transparent;
          color: var(--red); font-size: 15px; font-weight: 700; cursor: pointer; text-decoration: none; font-family: var(--font-dm);
        }

        .nav-mobile-only { display: none !important; }
        @media (max-width: 920px) {
          .nav-desktop-only { display: none !important; }
          .nav-mobile-only { display: flex !important; }
        }
        @media (max-width: 380px) {
          .nav-brand-text { font-size: 20px; }
          .nav-logo img { height: 38px; }
        }
      `}</style>
    </nav>
  );
}
