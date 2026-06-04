"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogIn, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { logoutAction } from "@/app/dashboard/actions";

export default function Nav() {
  const { user } = useAuth();
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
        <Link className="brand" href="/" aria-label="MonAgentPerso — Accueil">
          <img src="/logo.svg" alt="MonAgentPerso" className="brand-img" />
        </Link>

        <div className="navlinks">
          <Link href="/">Accueil</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <Link href="/dashboard" className="btn btn-light btn-nav">
                <LayoutDashboard size={16} strokeWidth={2.2} /> Mon espace
              </Link>
              <button
                type="button"
                className="btn btn-primary btn-nav"
                onClick={handleLogout}
                disabled={pending}
              >
                <LogOut size={16} strokeWidth={2.2} /> {pending ? "..." : "Déconnexion"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-light btn-nav">
                <LogIn size={16} strokeWidth={2.2} /> Connexion
              </Link>
              <Link href="/login?next=questionnaire" className="btn btn-primary btn-nav">
                <Sparkles size={16} strokeWidth={2.2} /> Réclamer mon agent IA
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Menu mobile">
          <div className="mobile-menu-section">
            <Link href="/">Accueil</Link>
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className="mobile-menu-section mobile-menu-actions">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-light">
                  <LayoutDashboard size={18} strokeWidth={2.2} /> Mon espace
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogout}
                  disabled={pending}
                >
                  <LogOut size={18} strokeWidth={2.2} /> {pending ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-light">
                  <LogIn size={18} strokeWidth={2.2} /> Connexion
                </Link>
                <Link href="/login?next=questionnaire" className="btn btn-primary">
                  <Sparkles size={18} strokeWidth={2.2} /> Réclamer mon agent IA
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
