"use client";

import { useTransition } from "react";
import { logoutAction } from "./actions";
import { useLocale } from "@/lib/i18n/context";

export default function LogoutButton() {
  const { t } = useLocale();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-light"
      disabled={pending}
      onClick={() => start(() => logoutAction())}
    >
      {pending ? t.dashboard.loggingOut : t.dashboard.logout}
    </button>
  );
}
