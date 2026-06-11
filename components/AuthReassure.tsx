"use client";

import Link from "next/link";
import { Lock, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useLocale } from "@/lib/i18n/context";

export default function AuthReassure() {
  const { user } = useAuth();
  const { t } = useLocale();

  if (user) {
    return (
      <div className="auth-reassure">
        <span className="auth-reassure-ico"><LayoutDashboard size={18} strokeWidth={2.2} /></span>
        <span className="auth-reassure-text">{t.authReassure.connected}</span>
        <Link href="/dashboard" className="auth-reassure-cta">
          {t.authReassure.goSpace}
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-reassure">
      <span className="auth-reassure-ico"><Lock size={18} strokeWidth={2.2} /></span>
      <span className="auth-reassure-text">{t.authReassure.createPrompt}</span>
      <Link href="/signup" className="auth-reassure-cta">
        {t.authReassure.createCta}
      </Link>
    </div>
  );
}
