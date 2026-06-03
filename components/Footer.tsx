import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <img src="/logo.svg" alt="MonAgentPerso" style={{ height: 40, width: "auto" }} />
          <span>© 2026 — Agent IA métier personnalisé.</span>
        </div>
        <div>
          <Link href="/">Accueil</Link>
          <Link href="/agents-gpt">Agents IA</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/programme-partenaire">Programme partenaire</Link>
        </div>
      </div>
    </footer>
  );
}
