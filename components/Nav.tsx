"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogIn, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { logoutAction } from "@/app/dashboard/actions";
import WheelNavButton from "./wheel/WheelNavButton";
import LangSwitcher from "./LangSwitcher";
import { useLocale } from "@/lib/i18n/context";

export default function Nav() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pending, start] = useTransition();
  const pathname = usePathname();

  // Ferme le menu mobile à chaque changement de route.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bloque le scroll body quand le menu mobile est ouvert.
  useEffect(() => {
    if (mobileOpen) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [mobileOpen]);

  function handleLogout() {
    start(() => logoutAction());
  }

  return (
    <nav>
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label={t.nav.brandHome}>
          <img src="/logo.svg" alt="MonAgentPerso" className="brand-img" />
        </Link>

        <div className="navlinks">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/marketplace">{t.nav.marketplace}</Link>
          <Link href="/blog">{t.nav.blog}</Link>
          <Link href="/pricing">{t.nav.pricing}</Link>
          <WheelNavButton />
        </div>

        <div className="nav-actions">
          <LangSwitcher />
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-light btn-nav">
                <LayoutDashboard size={16} strokeWidth={2.2} /> {t.nav.dashboard}
              </Link>
              <button
                type="button"
                className="btn btn-primary btn-nav"
                onClick={handleLogout}
                disabled={pending}
              >
                <LogOut size={16} strokeWidth={2.2} /> {pending ? "..." : t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-light btn-nav">
                <LogIn size={16} strokeWidth={2.2} /> {t.nav.login}
              </Link>
              <Link href="/login?next=questionnaire" className="btn btn-primary btn-nav">
                <Sparkles size={16} strokeWidth={2.2} /> {t.nav.claimAgent}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-label={t.nav.mobileMenu}>
          <div className="mobile-menu-section">
            <Link href="/">{t.nav.home}</Link>
            <Link href="/marketplace">{t.nav.marketplace}</Link>
            <Link href="/blog">{t.nav.blog}</Link>
            <Link href="/pricing">{t.nav.pricing}</Link>
            <WheelNavButton mobile />
          </div>
          <div className="mobile-menu-section mobile-menu-actions">
            <LangSwitcher />
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-light">
                  <LayoutDashboard size={18} strokeWidth={2.2} /> {t.nav.dashboard}
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogout}
                  disabled={pending}
                >
                  <LogOut size={18} strokeWidth={2.2} /> {pending ? t.nav.loggingOut : t.nav.logoutMobile}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-light">
                  <LogIn size={18} strokeWidth={2.2} /> {t.nav.login}
                </Link>
                <Link href="/login?next=questionnaire" className="btn btn-primary">
                  <Sparkles size={18} strokeWidth={2.2} /> {t.nav.claimAgent}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
