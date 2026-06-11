import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export default async function BlogPage() {
  const t = await getDict();
  const b = t.blog;
  return (
    <div className="container blog-page">
      <span className="section-eyebrow">{b.indexEyebrow}</span>
      <h1>{b.indexH1}</h1>
      <p className="section-sub" style={{ marginTop: 16, maxWidth: 720 }}>
        {b.indexSub}
      </p>
      <div className="blog-grid">
        {b.cards.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
            <div className="big-picto">{a.icon}</div>
            <h3>{a.title}</h3>
            <p>{a.excerpt}</p>
            <span className="blog-card-cta">{b.readArticle}</span>
            <span style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 600 }}>{a.readTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
