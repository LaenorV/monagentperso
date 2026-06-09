import Link from "next/link";

const articles = [
  {
    slug: "preparer-agent-personnalise",
    icon: "▣",
    title: "Comment préparer un bon agent personnalisé",
    excerpt:
      "Un agent efficace dépend surtout de vos exemples, de vos règles et de vos cas concrets. Le bon cadrage fait gagner du temps dès la première utilisation.",
    readTime: "6 min de lecture",
  },
  {
    slug: "chatgpt-claude-gemini",
    icon: "◈",
    title: "ChatGPT, Claude ou Gemini : que choisir ?",
    excerpt:
      "Le bon choix dépend de votre usage : rédaction, documents longs, logique métier, recherche, livrables ou simplicité d'utilisation.",
    readTime: "7 min de lecture",
  },
  {
    slug: "taches-a-deleguer",
    icon: "⚙",
    title: "Les tâches métiers les plus simples à déléguer",
    excerpt:
      "Emails, comptes rendus, posts, réponses clients, devis ou synthèses : les meilleurs premiers usages sont souvent les plus répétitifs.",
    readTime: "5 min de lecture",
  },
  {
    slug: "prompt-methode-6-blocs",
    icon: "◆",
    title: "Écrire un prompt qui marche : la méthode des 6 blocs",
    excerpt:
      "Rôle, contexte, tâche, format, contraintes, exemples : la structure exacte d'un prompt efficace, plus les 3 techniques (few-shot, raisonnement, décomposition) et un avant/après concret.",
    readTime: "7 min de lecture",
  },
  {
    slug: "humaniser-texte-ia",
    icon: "◐",
    title: "Faire écrire l'IA sans que ça se voie",
    excerpt:
      "Perplexité, burstiness, tics de langage : ce que détectent vraiment les détecteurs d'IA, et 7 réglages concrets pour un texte naturel — sans changer le sens.",
    readTime: "7 min de lecture",
  },
];

export default function BlogPage() {
  return (
    <div className="container blog-page">
      <span className="section-eyebrow">Blog</span>
      <h1>Guides pratiques pour utiliser un agent métier.</h1>
      <p className="section-sub" style={{ marginTop: 16, maxWidth: 720 }}>
        Conseils, méthodes et bonnes pratiques pour tirer le meilleur de votre agent IA personnalisé,
        sans jargon et sans perdre de temps.
      </p>
      <div className="blog-grid">
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
            <div className="big-picto">{a.icon}</div>
            <h3>{a.title}</h3>
            <p>{a.excerpt}</p>
            <span className="blog-card-cta">
              Lire l'article →
            </span>
            <span style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 600 }}>{a.readTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
