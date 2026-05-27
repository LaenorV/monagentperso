"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * CTA "Réclamer mon agent" — auth-aware.
 * - User non connecté → /login?next=questionnaire (avec lien vers /signup dans la page)
 * - User connecté     → /dashboard?openQuestionnaire=1 (le dashboard ouvre le modal au mount)
 *
 * Pour ouvrir directement le questionnaire (sur /dashboard), utiliser <QuestionnaireCta>.
 */
export default function CtaButton({ children, className = "btn btn-primary", style }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  function handleClick() {
    router.push(user ? "/dashboard?openQuestionnaire=1" : "/login?next=questionnaire");
  }

  return (
    <button type="button" className={className} style={style} onClick={handleClick}>
      {children}
    </button>
  );
}
