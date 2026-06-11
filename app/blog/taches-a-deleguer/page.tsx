import type { Metadata } from "next";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "The easiest professional tasks to delegate — MonAgentPerso",
      description:
        "Where to start delegating to your AI agent? A pragmatic list of the first tasks to automate, ranked by time saved and ease of setup.",
    };
  }
  return {
    title: "Les tâches métiers les plus simples à déléguer — MonAgentPerso",
    description:
      "Par où commencer pour déléguer à votre agent IA ? Liste pragmatique des premières tâches à automatiser, classées par gain de temps et facilité de mise en place.",
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
          <span className="section-eyebrow">Putting it into practice</span>
          <span>· 5 min read</span>
        </div>
        <h1>The easiest professional tasks to delegate</h1>
        <p className="article-lead">
          You have a personalized agent. The logical question: where to start? Not with the most complex or
          most strategic tasks. The first wins hide in the repetitive, low-value gestures you do without even
          thinking.
        </p>

        <div className="article-content">
          <p>
            When you discover an AI agent, you tend to want to hand it the hard tasks. Bad idea. The fastest
            return on investment is in <strong>simple but frequent tasks</strong>. The ones that take fifteen
            minutes each time, but come back ten times a week. Here's how to spot them and delegate them
            effectively.
          </p>

          <h2>1. The criterion that guides everything: repetition</h2>
          <p>
            An ideal task to delegate meets three conditions. If one is missing, you risk spending more time
            briefing the agent than doing the task yourself.
          </p>
          <ul>
            <li><strong>Frequent</strong>: you do it at least once a week.</li>
            <li><strong>Structured</strong>: it follows a recognizable pattern (same kind of input, same kind of output).</li>
            <li><strong>Low strategic value</strong>: it's necessary but doesn't require your unique judgment.</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The “five times” test</strong>
              If you've done the same task at least five times this month with a similar format, it's a perfect
              candidate for delegation.
            </div>
          </div>

          <h2>2. The six families of tasks to delegate first</h2>
          <p>
            Based on what we observe among professionals who adopt a personalized agent, six families
            concentrate most of the first time savings.
          </p>

          <h3>Recurring emails</h3>
          <p>
            Replies to typical requests, polite follow-ups, detailed acknowledgements, scheduling messages. An
            agent that masters your tone produces in 30 seconds what you used to write in 5 minutes. Multiply by
            20 emails a day: the gain is considerable.
          </p>

          <h3>Meeting minutes</h3>
          <p>
            You pass your raw notes or a recording's transcript to the agent, and it returns a structured set of
            minutes, ready to share. It's one of the highest-ROI tasks.
          </p>

          <h3>Social media posts</h3>
          <p>
            From a raw idea or a recent article, the agent produces 3 to 5 variants adapted to each platform,
            keeping your style. You choose, you adjust, you publish.
          </p>

          <h3>First-level client replies</h3>
          <p>
            Frequent questions, information requests, clarifications about your services. The agent drafts a
            first reply you validate or adjust. The tone stays controlled, your response time drops drastically.
          </p>

          <h3>Standard quotes and proposals</h3>
          <p>
            For a profession that produces lots of small quotes (tradespeople, service providers, agencies), an
            agent that knows your services and prices generates the quote's skeleton in seconds. You just
            personalize the final touch.
          </p>

          <h3>Summaries and reading notes</h3>
          <p>
            In-depth article, industry report, interview transcript: the agent extracts the essentials into a few
            key points, sorted by your criteria (what interests you, what could serve a given client, what
            deserves action).
          </p>

          <h2>3. The tasks NOT to hand over (at first)</h2>
          <p>
            Not all tasks are good to delegate right away. A few cases where it's better to keep control, at
            least during the first weeks:
          </p>
          <ul>
            <li><strong>Highly technical core-business topics</strong>, where a mistake engages your liability.</li>
            <li><strong>Delicate negotiations</strong> where every word counts, and where you know exactly which register to adopt.</li>
            <li><strong>Emotionally charged communications</strong> (dispute, bereavement, conflict).</li>
            <li><strong>Firm commitments to figures</strong> without human review.</li>
          </ul>
          <p>
            The general rule: <strong>the agent prepares, you validate</strong>. The higher the stakes, the more
            careful your review.
          </p>

          <blockquote>
            “The agent doesn't replace your judgment. It saves you the twenty minutes it took to reach the right
            draft.”
          </blockquote>

          <h2>4. How to estimate a delegation's ROI</h2>
          <p>
            To quickly assess whether a task is worth delegating, do this little mental math:
          </p>
          <ol>
            <li>Average time to do the task today: <em>X minutes</em>.</li>
            <li>Number of times you do it per week: <em>Y times</em>.</li>
            <li>Total weekly time: <em>X × Y minutes</em>.</li>
            <li>With the agent, this time is typically divided by 3 to 5.</li>
          </ol>
          <p>
            If the task takes more than <strong>30 cumulative minutes a week</strong>, delegating it frees up
            significant time over a month.
          </p>

          <h2>5. The first-three-weeks roadmap</h2>
          <p>Here's how we recommend organizing your first weeks with a personalized agent:</p>
          <ul>
            <li><strong>Week 1</strong> — A single family of tasks (for example, recurring emails). Note the time saved and the edits needed.</li>
            <li><strong>Week 2</strong> — Add a second family (for example, meeting minutes). Adjust your brief if needed.</li>
            <li><strong>Week 3</strong> — Extend to 4-5 families. By now the agent is dialed in and you've identified your best use cases.</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">⚡</div>
            <div>
              <strong>Best practice</strong>
              Keep a file where you note: the delegated task, the estimated time saved, the adjustments you made.
              This file becomes your knowledge base to iterate on the agent.
            </div>
          </div>

          <h2>In short</h2>
          <p>
            The best tasks to delegate aren't the most impressive: they're the most <strong>repetitive and
            structured</strong>. Recurring emails, meeting minutes, posts, client replies, standard quotes and
            summaries make up the six families to explore first. Start small, measure the real gain, then expand
            gradually. In a few weeks you'll have reclaimed several hours a week — without changing anything
            about the quality of your work.
          </p>
        </div>

        <div className="article-cta">
          <h3>What if we identified your best tasks to delegate?</h3>
          <p>Our questionnaire helps you isolate the most profitable tasks to hand to your agent.</p>
          <CtaButton className="btn btn-primary btn-xl">Start my questionnaire →</CtaButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Mise en pratique</span>
        <span>· 5 min de lecture</span>
      </div>
      <h1>Les tâches métiers les plus simples à déléguer</h1>
      <p className="article-lead">
        Vous avez un agent personnalisé. Question logique : par où commencer ? Pas par les tâches les plus
        complexes ni les plus stratégiques. Les premières victoires se cachent dans les gestes répétitifs et
        peu valorisants que vous faites sans même y penser.
      </p>

      <div className="article-content">
        <p>
          Quand on découvre un agent IA, on a tendance à vouloir lui confier les tâches difficiles. Mauvaise
          idée. Le retour sur investissement le plus rapide se trouve dans <strong>les tâches simples mais
          fréquentes</strong>. Celles qui prennent quinze minutes à chaque fois, mais qui reviennent dix fois
          par semaine. Voici comment les identifier et les déléguer efficacement.
        </p>

        <h2>1. Le critère qui guide tout : la répétition</h2>
        <p>
          Une tâche idéale à déléguer remplit trois conditions. Si l'une d'elles manque, vous risquez de perdre
          plus de temps à briefer l'agent qu'à faire la tâche vous-même.
        </p>
        <ul>
          <li><strong>Fréquente</strong> : vous la faites au moins une fois par semaine.</li>
          <li><strong>Structurée</strong> : elle suit un schéma reconnaissable (même type d'entrée, même type de sortie).</li>
          <li><strong>Faible valeur stratégique</strong> : elle est nécessaire mais ne demande pas votre jugement unique.</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>Le test du « cinq fois »</strong>
            Si vous avez fait la même tâche au moins cinq fois ce mois-ci avec un format similaire, c'est un
            candidat parfait à la délégation.
          </div>
        </div>

        <h2>2. Les six familles de tâches à déléguer en priorité</h2>
        <p>
          D'après ce que nous observons chez les professionnels qui adoptent un agent personnalisé, six
          familles concentrent l'essentiel des premiers gains de temps.
        </p>

        <h3>Les emails récurrents</h3>
        <p>
          Réponses à des demandes types, relances polies, accusés de réception circonstanciés, messages de
          rendez-vous. Un agent qui maîtrise votre ton produit en 30 secondes ce que vous écriviez en 5
          minutes. Multipliez par 20 emails par jour : le gain est considérable.
        </p>

        <h3>Les comptes-rendus de réunion</h3>
        <p>
          Vous passez vos notes brutes ou la transcription d'un enregistrement à l'agent, il vous renvoie
          un compte-rendu structuré, prêt à être diffusé. C'est l'une des tâches au plus fort retour sur
          investissement.
        </p>

        <h3>Les publications réseaux sociaux</h3>
        <p>
          À partir d'une idée brute ou d'un article récent, l'agent décline 3 à 5 variantes adaptées à
          chaque plateforme, en gardant votre style. Vous choisissez, vous ajustez, vous publiez.
        </p>

        <h3>Les réponses clients de premier niveau</h3>
        <p>
          Les questions fréquentes, les demandes d'information, les éclaircissements sur vos services. L'agent
          formule une première réponse que vous validez ou ajustez. Le ton reste maîtrisé, votre temps de
          réaction chute drastiquement.
        </p>

        <h3>Les devis et propositions standards</h3>
        <p>
          Pour un métier qui produit beaucoup de petits devis (artisans, prestataires de services, agences),
          un agent qui connaît vos prestations et vos prix génère le squelette du devis en quelques secondes.
          Vous personnalisez juste la touche finale.
        </p>

        <h3>Les synthèses et fiches de lecture</h3>
        <p>
          Article de fond, rapport sectoriel, transcription d'entretien : l'agent extrait l'essentiel en
          quelques points clés, classés selon vos critères (ce qui vous intéresse, ce qui peut servir à tel
          client, ce qui mérite une action).
        </p>

        <h2>3. Les tâches à ne PAS confier (au début)</h2>
        <p>
          Toutes les tâches ne sont pas bonnes à déléguer immédiatement. Quelques cas où il vaut mieux garder
          la main, au moins pendant les premières semaines :
        </p>
        <ul>
          <li><strong>Les sujets très techniques de votre cœur de métier</strong>, où une erreur engage votre responsabilité.</li>
          <li><strong>Les négociations délicates</strong> où chaque mot pèse, et où vous savez exactement quel registre adopter.</li>
          <li><strong>Les communications à forte charge émotionnelle</strong> (litige, deuil, conflit).</li>
          <li><strong>Les engagements chiffrés fermes</strong> sans relecture humaine.</li>
        </ul>
        <p>
          La règle générale : <strong>l'agent prépare, vous validez</strong>. Plus l'enjeu est élevé, plus
          votre relecture est minutieuse.
        </p>

        <blockquote>
          « L'agent ne remplace pas votre jugement. Il vous fait gagner les vingt minutes que vous mettiez
          à arriver au bon brouillon. »
        </blockquote>

        <h2>4. Comment estimer le ROI d'une délégation</h2>
        <p>
          Pour évaluer rapidement si une tâche vaut le coup d'être déléguée, faites ce petit calcul mental :
        </p>
        <ol>
          <li>Temps moyen pour faire la tâche aujourd'hui : <em>X minutes</em>.</li>
          <li>Nombre de fois où vous la faites par semaine : <em>Y fois</em>.</li>
          <li>Temps total hebdomadaire : <em>X × Y minutes</em>.</li>
          <li>Avec l'agent, ce temps est typiquement divisé par 3 à 5.</li>
        </ol>
        <p>
          Si la tâche occupe plus de <strong>30 minutes cumulées par semaine</strong>, la déléguer libère du
          temps significatif sur un mois.
        </p>

        <h2>5. La feuille de route des trois premières semaines</h2>
        <p>Voici comment nous recommandons d'organiser vos premières semaines avec un agent personnalisé :</p>
        <ul>
          <li><strong>Semaine 1</strong> — Une seule famille de tâches (par exemple, les emails récurrents). Notez le temps gagné et les retouches nécessaires.</li>
          <li><strong>Semaine 2</strong> — Ajoutez une deuxième famille (par exemple, les comptes-rendus). Ajustez votre brief si nécessaire.</li>
          <li><strong>Semaine 3</strong> — Étendez à 4-5 familles. À ce stade, l'agent est rodé et vous avez identifié vos meilleurs cas d'usage.</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">⚡</div>
          <div>
            <strong>Bonne pratique</strong>
            Gardez un fichier où vous notez : la tâche déléguée, le temps gagné estimé, les ajustements que
            vous avez apportés. Ce fichier devient votre base de connaissance pour itérer sur l'agent.
          </div>
        </div>

        <h2>En résumé</h2>
        <p>
          Les meilleures tâches à déléguer ne sont pas les plus impressionnantes : ce sont les plus
          <strong> répétitives et structurées</strong>. Emails récurrents, comptes-rendus, publications,
          réponses clients, devis standards et synthèses constituent les six familles à explorer en premier.
          Commencez petit, mesurez le gain réel, puis étendez progressivement. En quelques semaines, vous
          aurez récupéré plusieurs heures par semaine — sans rien changer à la qualité de votre travail.
        </p>
      </div>

      <div className="article-cta">
        <h3>Et si on identifiait vos meilleures tâches à déléguer ?</h3>
        <p>Notre questionnaire vous aide à isoler les tâches les plus rentables à confier à votre agent.</p>
        <CtaButton className="btn btn-primary btn-xl">Démarrer mon questionnaire →</CtaButton>
      </div>
    </div>
  );
}
