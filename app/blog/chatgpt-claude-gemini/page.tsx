import type { Metadata } from "next";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "ChatGPT, Claude or Gemini: which to choose? — MonAgentPerso",
      description:
        "An honest comparison of the three main AI assistants for professionals. Strengths, limits and use cases of ChatGPT, Claude and Gemini.",
    };
  }
  return {
    title: "ChatGPT, Claude ou Gemini : que choisir ? — MonAgentPerso",
    description:
      "Comparatif honnête des trois principaux assistants IA pour les professionnels. Forces, limites et cas d'usage de ChatGPT, Claude et Gemini.",
  };
}

export default async function ArticlePage() {
  const locale = await getLocale();
  const b = dictFor(locale).blog;
  if (locale === "en") {
    return (
      <div className="container article">
        <Link href="/blog" className="article-back">{b.backAll}</Link>
        <div className="article-meta">
          <span className="section-eyebrow">Comparison</span>
          <span>· 7 min read</span>
        </div>
        <h1>ChatGPT, Claude or Gemini: which to choose?</h1>
        <p className="article-lead">
          Three assistants, three philosophies, and one shared goal: saving you time. But the right choice
          depends on your real usage, not on the latest product announcement. Here's a pragmatic guide to pick
          the platform that fits you.
        </p>

        <div className="article-content">
          <p>
            The question comes up at every meeting: “Would you recommend ChatGPT, Claude or Gemini?”. Our answer
            is never the same. Because there's no best tool in the absolute, only a best tool for{" "}
            <strong>your profession, your deliverables, the way you work</strong>. This article gives you the
            criteria to decide without hesitation.
          </p>

          <h2>Three platforms, three main strengths</h2>
          <p>
            Before comparing in detail, remember these three positionings. They're not exhaustive, but they give
            the right starting angle.
          </p>
          <ul>
            <li><strong>ChatGPT</strong> is the <em>all-rounder</em>. It includes a real gallery of models, multimedia features (image, voice, code) and an ecosystem of custom GPTs that are very simple to create.</li>
            <li><strong>Claude</strong> excels at <em>long texts and editorial nuance</em>. Its large context window lets it ingest bulky documents, and its writing style is often considered the most natural of the three.</li>
            <li><strong>Gemini</strong> is the best <em>integrated into the Google environment</em>: Gmail, Drive, Docs, Sheets. Ideal if your day is already on Workspace.</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The key angle</strong>
              Don't choose based on technical benchmarks. Choose based on the tool you'll open 80% of the time:
              your email client, your Drive, your favorite chat interface.
            </div>
          </div>

          <h2>ChatGPT — when to choose it</h2>
          <p>
            ChatGPT stands out if your need combines several formats: generating text, creating an image,
            analyzing a file, browsing the web. Its <strong>“custom GPTs”</strong> feature lets anyone create an
            assistant dedicated to a use case, with their own documents and instructions. It's currently the most
            complete solution for a professional who wants a single tool able to cover 80% of their needs.
          </p>
          <h3>Strengths</h3>
          <ul>
            <li>Mature, easy-to-set-up custom-GPT ecosystem.</li>
            <li>Native multimodality (text, image, voice, code).</li>
            <li>Good at following complex instructions in a single interaction.</li>
            <li>Huge community, abundant resources, many third-party integrations.</li>
          </ul>
          <h3>Limits</h3>
          <ul>
            <li>On very long texts, the style can become more mechanical.</li>
            <li>Integration with classic office tools (Google, Microsoft) remains indirect.</li>
          </ul>

          <h2>Claude — when to choose it</h2>
          <p>
            Claude is our recommendation when your work relies on <strong>writing quality, nuance or document
            analysis</strong>. A consultant who produces reports, a lawyer who summarizes case files, a
            communications officer who polishes speeches: Claude generally delivers more natural, better-structured
            texts than its competitors.
          </p>
          <p>
            Its particularly large context window also lets it ingest very bulky documents (full reports,
            transcripts, internal books) and reason over them without chunking.
          </p>
          <h3>Strengths</h3>
          <ul>
            <li>Writing and nuance quality often superior on long texts.</li>
            <li>Excellent ability to analyze bulky documents.</li>
            <li>Rigorous instruction-following, few hallucinations on factual topics.</li>
            <li>A “project” format that centralizes instructions, files and conversations.</li>
          </ul>
          <h3>Limits</h3>
          <ul>
            <li>Fewer multimedia features than ChatGPT (image generation in particular).</li>
            <li>A more limited plugin/integration ecosystem.</li>
          </ul>

          <h2>Gemini — when to choose it</h2>
          <p>
            Gemini becomes obvious if your day revolves around <strong>Google Workspace</strong>. The assistant
            shows up directly in Gmail (writing and summarizing emails), Docs (writing and rephrasing), Sheets
            (formulas and summaries), Drive (searching your files). The integration is noticeably deeper than with
            the other two.
          </p>
          <h3>Strengths</h3>
          <ul>
            <li>Native integration in Gmail, Docs, Sheets, Drive, Calendar.</li>
            <li>Very good for short, contextual tasks (summarize an email, rephrase a paragraph).</li>
            <li>Solid web search with directly linked sources.</li>
            <li>Very good value within the Workspace subscription.</li>
          </ul>
          <h3>Limits</h3>
          <ul>
            <li>Deep personalization less polished than ChatGPT's GPTs.</li>
            <li>Writing style sometimes more rigid on long content.</li>
          </ul>

          <h2>The quick decision table</h2>
          <p>Here's a shortcut if you want to decide in 30 seconds:</p>
          <ul>
            <li><strong>You want a single tool that does everything</strong> → ChatGPT.</li>
            <li><strong>You produce a lot of long or nuanced text</strong> → Claude.</li>
            <li><strong>You work all day in Gmail / Docs / Drive</strong> → Gemini.</li>
            <li><strong>You want very deep, shareable personalization</strong> → ChatGPT (GPTs).</li>
            <li><strong>You regularly handle large documents (50+ pages)</strong> → Claude.</li>
          </ul>

          <blockquote>
            “The best tool is the one you'll actually open every morning. All the benchmarks in the world don't
            beat real daily use.”
          </blockquote>

          <h2>Still hesitating?</h2>
          <p>
            The good news is that all three platforms offer a free version or a trial. You can test them in
            parallel for a week on <strong>one and the same real task</strong> (a recurring email, a type of
            quote, a summary). For each output, note: quality, time saved, edits needed. By the end of the week the
            choice will be obvious — and based on your usage, not on a marketing promise.
          </p>

          <div className="article-callout">
            <div className="article-callout-ico">⚡</div>
            <div>
              <strong>Our advice</strong>
              When you entrust us with creating your agent via the questionnaire, we steer you toward the platform
              best suited to your profession — and we deliver the agent directly in the matching format (GPT,
              Claude.md or Gemini Gem).
            </div>
          </div>

          <h2>In short</h2>
          <p>
            There's no best AI assistant in the absolute. There's the one that best fits your day, your type of
            deliverables and your style. <strong>ChatGPT</strong> for versatility and easy-to-deploy custom agents.
            <strong> Claude</strong> for nuanced writing and bulky documents. <strong>Gemini</strong> for users
            already rooted in Google Workspace. Choosing isn't giving up: it's focusing your efforts.
          </p>
        </div>

        <div className="article-cta">
          <h3>Not sure which platform to choose?</h3>
          <p>Our questionnaire identifies the tool best suited to your profession — and we deliver the agent in the matching format.</p>
          <CtaButton className="btn btn-primary btn-xl">Start my questionnaire →</CtaButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Comparatif</span>
        <span>· 7 min de lecture</span>
      </div>
      <h1>ChatGPT, Claude ou Gemini : que choisir ?</h1>
      <p className="article-lead">
        Trois assistants, trois philosophies, et un même objectif : vous faire gagner du temps. Mais le bon
        choix dépend de votre usage réel, pas de la dernière annonce produit. Voici un guide pragmatique pour
        choisir la plateforme qui vous correspond.
      </p>

      <div className="article-content">
        <p>
          La question revient à chaque rendez-vous : « Vous me conseillez plutôt ChatGPT, Claude ou Gemini ? ».
          Notre réponse n'est jamais la même. Parce qu'il n'y a pas un meilleur outil dans l'absolu, mais un
          meilleur outil pour <strong>votre métier, vos livrables, votre manière de travailler</strong>. Cet
          article vous donne les critères pour trancher sans hésitation.
        </p>

        <h2>Trois plateformes, trois forces principales</h2>
        <p>
          Avant de comparer en détail, retenez ces trois positionnements. Ils ne sont pas exhaustifs, mais
          ils donnent le bon angle de départ.
        </p>
        <ul>
          <li><strong>ChatGPT</strong> est l'outil <em>polyvalent</em>. Il intègre une vraie galerie de modèles, des fonctionnalités multimédia (image, voix, code) et un écosystème de GPTs personnalisés très simples à créer.</li>
          <li><strong>Claude</strong> excelle sur les <em>textes longs et la nuance rédactionnelle</em>. Sa fenêtre de contexte large permet d'ingérer des documents volumineux, et son style d'écriture est souvent considéré comme le plus naturel des trois.</li>
          <li><strong>Gemini</strong> est le mieux <em>intégré à l'environnement Google</em> : Gmail, Drive, Docs, Sheets. Idéal si votre quotidien est déjà sur Workspace.</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>L'angle clé</strong>
            Ne choisissez pas en fonction des benchmarks techniques. Choisissez en fonction de l'outil que
            vous ouvrirez 80% du temps : votre client mail, votre Drive, votre interface de chat préférée.
          </div>
        </div>

        <h2>ChatGPT — quand le choisir</h2>
        <p>
          ChatGPT s'impose si votre besoin combine plusieurs formats : générer un texte, créer une image,
          analyser un fichier, naviguer sur le web. Sa fonctionnalité <strong>« GPTs personnalisés »</strong>
          permet à n'importe qui de créer un assistant dédié à un cas d'usage, avec ses propres documents et
          instructions. C'est aujourd'hui la solution la plus complète pour un professionnel qui veut un
          unique outil capable de couvrir 80% de ses besoins.
        </p>
        <h3>Points forts</h3>
        <ul>
          <li>Écosystème de GPTs personnalisés mature et simple à mettre en place.</li>
          <li>Multimodalité native (texte, image, voix, code).</li>
          <li>Bonne capacité à suivre des consignes complexes en une seule interaction.</li>
          <li>Communauté immense, ressources abondantes, intégrations tierces nombreuses.</li>
        </ul>
        <h3>Limites</h3>
        <ul>
          <li>Sur les textes très longs, le style peut devenir plus mécanique.</li>
          <li>L'intégration aux outils bureautiques classiques (Google, Microsoft) reste indirecte.</li>
        </ul>

        <h2>Claude — quand le choisir</h2>
        <p>
          Claude est notre recommandation quand votre métier repose sur <strong>la qualité d'écriture, la
          nuance ou l'analyse de documents</strong>. Un consultant qui produit des rapports, un avocat qui
          synthétise des dossiers, un chargé de communication qui peaufine des prises de parole : Claude
          délivre généralement des textes plus naturels et mieux structurés que ses concurrents.
        </p>
        <p>
          Sa fenêtre de contexte particulièrement large permet aussi d'ingérer des documents très volumineux
          (rapports complets, transcriptions, livres internes) et de raisonner dessus sans découpage.
        </p>
        <h3>Points forts</h3>
        <ul>
          <li>Qualité d'écriture et de nuance souvent supérieure sur les textes longs.</li>
          <li>Excellente capacité d'analyse de documents volumineux.</li>
          <li>Suivi rigoureux des consignes, peu d'hallucinations sur les sujets factuels.</li>
          <li>Format « projet » qui permet de centraliser instructions, fichiers et conversations.</li>
        </ul>
        <h3>Limites</h3>
        <ul>
          <li>Moins de fonctionnalités multimédia que ChatGPT (génération d'image notamment).</li>
          <li>Écosystème de plugins/intégrations plus restreint.</li>
        </ul>

        <h2>Gemini — quand le choisir</h2>
        <p>
          Gemini devient évident si votre quotidien tourne autour de <strong>Google Workspace</strong>.
          L'assistant s'invite directement dans Gmail (rédaction et résumé d'emails), Docs (rédaction et
          reformulation), Sheets (formules et synthèses), Drive (recherche dans vos fichiers). L'intégration
          est nettement plus profonde qu'avec les deux autres.
        </p>
        <h3>Points forts</h3>
        <ul>
          <li>Intégration native dans Gmail, Docs, Sheets, Drive, Calendar.</li>
          <li>Très bon pour les tâches courtes et contextuelles (résumer un mail, reformuler un paragraphe).</li>
          <li>Recherche web solide avec sources liées directement.</li>
          <li>Très bon rapport qualité-prix dans l'abonnement Workspace.</li>
        </ul>
        <h3>Limites</h3>
        <ul>
          <li>Personnalisation profonde moins aboutie que les GPTs ChatGPT.</li>
          <li>Style d'écriture parfois plus rigide sur les contenus longs.</li>
        </ul>

        <h2>Le tableau de décision rapide</h2>
        <p>Voici un raccourci si vous voulez trancher en 30 secondes :</p>
        <ul>
          <li><strong>Vous voulez un seul outil qui fait tout</strong> → ChatGPT.</li>
          <li><strong>Vous produisez beaucoup de texte long ou nuancé</strong> → Claude.</li>
          <li><strong>Vous travaillez toute la journée dans Gmail / Docs / Drive</strong> → Gemini.</li>
          <li><strong>Vous voulez une personnalisation très poussée et partageable</strong> → ChatGPT (GPTs).</li>
          <li><strong>Vous traitez régulièrement de gros documents (50+ pages)</strong> → Claude.</li>
        </ul>

        <blockquote>
          « Le meilleur outil est celui que vous ouvrirez vraiment chaque matin. Tous les benchmarks du monde
          ne battent pas un usage réel quotidien. »
        </blockquote>

        <h2>Et si vous hésitez encore ?</h2>
        <p>
          La bonne nouvelle, c'est que les trois plateformes proposent une version gratuite ou un essai. Vous
          pouvez tester en parallèle pendant une semaine sur <strong>une seule et même tâche réelle</strong>
          (un email récurrent, un type de devis, une synthèse). Notez pour chaque sortie : qualité, temps
          gagné, retouches nécessaires. À la fin de la semaine, le choix sera évident — et basé sur votre
          usage, pas sur une promesse marketing.
        </p>

        <div className="article-callout">
          <div className="article-callout-ico">⚡</div>
          <div>
            <strong>Notre conseil</strong>
            Quand vous nous confiez la création de votre agent via le questionnaire, nous vous orientons vers
            la plateforme la plus adaptée à votre métier — et nous livrons l'agent directement dans le format
            correspondant (GPT, Claude.md ou Gemini Gem).
          </div>
        </div>

        <h2>En résumé</h2>
        <p>
          Il n'y a pas de meilleur assistant IA dans l'absolu. Il y a celui qui s'intègre le mieux à votre
          quotidien, votre type de livrables et votre style. <strong>ChatGPT</strong> pour la polyvalence et
          les agents personnalisés simples à déployer. <strong>Claude</strong> pour l'écriture nuancée et les
          documents volumineux. <strong>Gemini</strong> pour les utilisateurs déjà ancrés dans Google
          Workspace. Choisir, ce n'est pas renoncer : c'est concentrer ses efforts.
        </p>
      </div>

      <div className="article-cta">
        <h3>Pas sûr de la plateforme à choisir ?</h3>
        <p>Notre questionnaire identifie l'outil le plus adapté à votre métier — et nous livrons l'agent dans le format correspondant.</p>
        <CtaButton className="btn btn-primary btn-xl">Lancer mon questionnaire →</CtaButton>
      </div>
    </div>
  );
}
