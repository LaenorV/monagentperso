import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export default async function Footer() {
  const t = await getDict();
  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <img src="/logo.svg" alt="MonAgentPerso" style={{ height: 40, width: "auto" }} />
          <span>{t.footer.rights}</span>
        </div>
        <div>
          <Link href="/">{t.footer.home}</Link>
          <Link href="/blog">{t.footer.blog}</Link>
          <Link href="/pricing">{t.footer.pricing}</Link>
          <Link href="/programme-partenaire">{t.footer.partner}</Link>
        </div>
      </div>
    </footer>
  );
}
