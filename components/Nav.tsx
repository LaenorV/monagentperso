"use client";

import Link from "next/link";
import { useModal } from "./ModalContext";

export default function Nav() {
  const { open } = useModal();
  return (
    <nav>
      <div className="container nav-inner">
        <Link className="brand" href="/" aria-label="MonAgentPerso — Accueil">
          <img src="/logo.svg" alt="MonAgentPerso" className="brand-img" />
        </Link>
        <div className="navlinks">
          <Link href="/">Accueil</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <button className="btn btn-primary" onClick={open}>
          Réclamer mon agent IA
        </button>
      </div>
    </nav>
  );
}
