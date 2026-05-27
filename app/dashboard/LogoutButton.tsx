"use client";

import { useTransition } from "react";
import { logoutAction } from "./actions";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-light"
      disabled={pending}
      onClick={() => start(() => logoutAction())}
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
