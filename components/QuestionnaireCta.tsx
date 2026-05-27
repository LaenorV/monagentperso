"use client";

import { useModal } from "./ModalContext";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * CTA qui ouvre directement le modal questionnaire.
 * À utiliser depuis /dashboard où l'utilisateur est déjà authentifié.
 */
export default function QuestionnaireCta({
  children,
  className = "btn btn-primary",
  style,
}: Props) {
  const { open } = useModal();
  return (
    <button type="button" className={className} style={style} onClick={open}>
      {children}
    </button>
  );
}
