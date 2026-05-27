"use client";

import Link from "next/link";
import { Lock, LayoutDashboard } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function AuthReassure() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="auth-reassure">
        <span className="auth-reassure-ico"><LayoutDashboard size={18} strokeWidth={2.2} /></span>
        <span className="auth-reassure-text">
          Vous êtes connecté.
        </span>
        <Link href="/dashboard" className="auth-reassure-cta">
          Aller à mon espace →
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-reassure">
      <span className="auth-reassure-ico"><Lock size={18} strokeWidth={2.2} /></span>
      <span className="auth-reassure-text">
        Créez votre compte pour sauvegarder votre progression et accéder à votre espace personnel.
      </span>
      <Link href="/signup" className="auth-reassure-cta">
        Créer mon compte gratuitement →
      </Link>
    </div>
  );
}
