import type { Metadata } from "next";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "How to prepare a good personalized agent — MonAgentPerso",
      description:
        "A complete method to frame your AI agent: examples, rules, concrete cases. Avoid the pitfalls and save time from the very first use.",
    };
  }
  return {
    title: "Comment préparer un bon agent personnalisé — MonAgentPerso",
    description:
      "Méthode complète pour cadrer votre agent IA : exemples, règles, cas concrets. Évitez les pièges et gagnez du temps dès la première utilisation.",
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
          <span className="section-eyebrow">Practical guide</span>
          <span>· 6 min read</span>
        </div>
        <h1>How to prepare a good personalized agent</h1>
        <p className="article-lead">
          The quality of an AI agent doesn't depend on the model used, but on the material you give it.
          A well-framed agent, with the right examples and the right rules, becomes an effective copilot
          from the very first use. Here's the method.
        </p>

        <div className="article-content">
          <p>
            Most professionals starting out with a personalized AI agent make the same mistake: they
            describe what they want to obtain, without explaining <strong>how they actually work</strong>.
            The result: the agent answers well… but not in their place. The tone is generic, the answers
            lack precision, and everything has to be rewritten by hand. This article gives you the opposite
            framing: that of an agent that truly mimics the way you think and produce.
          </p>

          <h2>1. The three ingredients of an effective agent</h2>
          <p>
            A high-performing personalized agent rests on a simple trio. If one of the three elements is
            missing, the agent stays generic and won't deliver the time savings you hoped for.
          </p>
          <ul>
            <li><strong>Your examples.</strong> The most valuable material: 3 to 5 real deliverables you produced recently and are happy with.</li>
            <li><strong>Your rules.</strong> The implicit constraints of your profession: what you always do, what you never do, your preferred formats.</li>
            <li><strong>Your concrete cases.</strong> The recurring situations the agent will have to handle, framed with their real context.</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>Keep in mind</strong>
              An agent doesn't guess your profession. It mimics what you show it. A single well-commented
              example is worth ten abstract instructions.
            </div>
          </div>

          <h2>2. Your examples: the raw material</h2>
          <p>
            Before even thinking about writing instructions, pick <strong>3 to 5 deliverables you would
            unhesitatingly call representative of your work</strong>. For each example, add two or three
            lines of comment:
          </p>
          <ul>
            <li>The context: who is this document for, for what need?</li>
            <li>What makes it a good deliverable in your eyes (the structure, the tone, a particular detail).</li>
            <li>What you would absolutely not do in this context (a phrase to avoid, an approach you reject).</li>
          </ul>
          <p>
            These comments are as important as the examples themselves. They turn a raw document into{" "}
            <strong>teaching material for your agent</strong>.
          </p>

          <h3>How to choose your examples</h3>
          <p>
            Avoid your finest deliverables if they aren't your most representative. The agent needs to know
            how to produce your <em>daily standard</em>, not just your quality peak. Mix:
          </p>
          <ul>
            <li>A short deliverable (email, quick reply).</li>
            <li>A medium deliverable (report, project sheet).</li>
            <li>A long or structured deliverable (quote, report, analysis).</li>
          </ul>

          <h2>3. Your rules: what's never said, but always applied</h2>
          <p>
            Every profession has its tacit rules. The challenge is to make them explicit. Ask yourself these
            questions and write down the answers:
          </p>
          <ul>
            <li>Which words or expressions do you use systematically?</li>
            <li>Which words or expressions do you never use (often a competitor's jargon)?</li>
            <li>Which formats do you impose (title + 3 paragraphs, bullet lists, a specific signature)?</li>
            <li>Which topics require particular caution (committing to figures, legal advice, promising results)?</li>
            <li>What average length for each type of deliverable?</li>
          </ul>

          <blockquote>
            “A good agent isn't the one that can do everything. It's the one that knows what it must not do.”
          </blockquote>

          <h2>4. Your concrete cases: leaving abstraction behind</h2>
          <p>
            The biggest difference between an average agent and an excellent one plays out here. List 5 to 10
            recurring situations you face in your week. For each one, describe:
          </p>
          <ol>
            <li>The <strong>typical request</strong> as it arrives (email, call, message).</li>
            <li>The <strong>typical reply</strong> you would give, as is, word for word.</li>
            <li>The <strong>possible variants</strong> depending on context (rushed client, sensitive request…).</li>
          </ol>
          <p>
            These concrete cases will serve as the agent's reference for answering all the similar situations
            it later encounters. That's what makes the difference between a generic agent and a copilot that
            truly talks like you.
          </p>

          <h2>5. The most common pitfalls</h2>
          <p>Here are the mistakes we see most often among professionals going it alone:</p>
          <ul>
            <li><strong>The abstract brief.</strong> “I want an agent that helps with my emails” — without specifying which type of email, to whom, for what goal.</li>
            <li><strong>Contradictions.</strong> Asking for a tone that's both “formal” and “casual” without saying in which case.</li>
            <li><strong>No guardrails.</strong> Not telling the agent what it <em>must not</em> do. The result: it takes liberties that cause problems.</li>
            <li><strong>Too many instructions, not enough examples.</strong> An agent learns better from 3 well-commented examples than from 30 lines of guidelines.</li>
          </ul>

          <h2>6. Test and adjust</h2>
          <p>
            Once you receive your agent, plan <strong>15 minutes of hands-on time</strong>. Submit one of your
            typical requests and compare its answer to the one you would have produced. Note the gaps: tone too
            formal, imprecise vocabulary, different structure. These gaps are the basis of your next iteration.
            A good agent isn't fixed: it sharpens over the weeks.
          </p>

          <div className="article-callout">
            <div className="article-callout-ico">⚡</div>
            <div>
              <strong>The winning reflex</strong>
              Systematically note the edits you make by hand on the agent's first outputs. These edits are the
              shopping list for the next, even more precise version.
            </div>
          </div>

          <h2>In short</h2>
          <p>
            A good personalized agent isn't the result of a magic instruction. It's the result of rigorous
            framing: <strong>your best examples, your unspoken rules, your real cases</strong>. When these three
            pillars are well laid, the agent becomes a true extension of your know-how, and you reclaim several
            hours a week on tasks that weighed on you.
          </p>
        </div>

        <div className="article-cta">
          <h3>Ready to take action?</h3>
          <p>Our questionnaire guides you to provide everything needed for a successful agent.</p>
          <CtaButton className="btn btn-primary btn-xl">Create my personalized agent →</CtaButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Guide pratique</span>
        <span>· 6 min de lecture</span>
      </div>
      <h1>Comment préparer un bon agent personnalisé</h1>
      <p className="article-lead">
        La qualité d'un agent IA ne dépend pas du modèle utilisé, mais de la matière que vous lui transmettez.
        Un agent bien cadré, avec les bons exemples et les bonnes règles, devient un copilote efficace dès la
        première utilisation. Voici la méthode.
      </p>

      <div className="article-content">
        <p>
          La plupart des professionnels qui se lancent dans la création d'un agent IA personnalisé font la même
          erreur : ils décrivent ce qu'ils veulent obtenir, sans expliquer <strong>comment ils travaillent
          vraiment</strong>. Résultat : l'agent répond bien… mais pas à leur place. Le ton est générique, les
          réponses manquent de précision, et il faut tout réécrire à la main. Cet article vous donne le cadre
          inverse : celui d'un agent qui imite vraiment votre façon de penser et de produire.
        </p>

        <h2>1. Les trois ingrédients d'un agent efficace</h2>
        <p>
          Un agent personnalisé performant repose sur un triptyque simple. Si l'un des trois éléments manque,
          l'agent reste générique et ne vous apporte pas le gain de temps espéré.
        </p>
        <ul>
          <li><strong>Vos exemples.</strong> Le matériau le plus précieux : 3 à 5 livrables réels que vous avez produits récemment et dont vous êtes satisfait.</li>
          <li><strong>Vos règles.</strong> Les contraintes implicites de votre métier : ce que vous faites systématiquement, ce que vous ne faites jamais, vos formats préférés.</li>
          <li><strong>Vos cas concrets.</strong> Les situations récurrentes auxquelles l'agent devra répondre, formulées avec leur contexte réel.</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>À retenir</strong>
            Un agent ne devine pas votre métier. Il imite ce que vous lui montrez. Un seul exemple bien commenté
            vaut dix instructions abstraites.
          </div>
        </div>

        <h2>2. Vos exemples : la matière première</h2>
        <p>
          Avant même de penser à rédiger des instructions, sélectionnez <strong>3 à 5 livrables que vous
          produiriez sans hésitation comme étant représentatifs de votre travail</strong>. Pour chaque
          exemple, ajoutez deux ou trois lignes de commentaire :
        </p>
        <ul>
          <li>Le contexte : à qui s'adresse ce document, pour quel besoin ?</li>
          <li>Ce qui en fait un bon livrable selon vous (la structure, le ton, un détail particulier).</li>
          <li>Ce que vous ne feriez surtout pas dans ce contexte (une formule à éviter, une approche refusée).</li>
        </ul>
        <p>
          Ces commentaires sont aussi importants que les exemples eux-mêmes. Ils transforment un document brut
          en <strong>matériau pédagogique pour votre agent</strong>.
        </p>

        <h3>Comment choisir vos exemples</h3>
        <p>
          Évitez vos plus beaux livrables si ce ne sont pas vos plus représentatifs. L'agent doit savoir
          produire votre <em>standard quotidien</em>, pas seulement votre pic de qualité. Mixez :
        </p>
        <ul>
          <li>Un livrable court (email, réponse rapide).</li>
          <li>Un livrable moyen (compte-rendu, fiche projet).</li>
          <li>Un livrable long ou structuré (devis, rapport, analyse).</li>
        </ul>

        <h2>3. Vos règles : ce qui n'est jamais dit, mais toujours appliqué</h2>
        <p>
          Chaque métier a ses règles tacites. Le défi consiste à les rendre explicites. Posez-vous ces
          questions et notez les réponses :
        </p>
        <ul>
          <li>Quels mots ou expressions utilisez-vous systématiquement ?</li>
          <li>Quels mots ou expressions n'utilisez-vous jamais (souvent un jargon de concurrents) ?</li>
          <li>Quels formats imposez-vous (titre + 3 paragraphes, listes à puces, signature spécifique) ?</li>
          <li>Quels sujets exigent une prudence particulière (engagement chiffré, conseil juridique, promesse de résultat) ?</li>
          <li>Quelle longueur moyenne pour chaque type de livrable ?</li>
        </ul>

        <blockquote>
          « Un bon agent n'est pas celui qui sait tout faire. C'est celui qui sait ce qu'il ne doit pas faire. »
        </blockquote>

        <h2>4. Vos cas concrets : sortir de l'abstraction</h2>
        <p>
          La plus grosse différence entre un agent moyen et un agent excellent se joue ici. Listez 5 à 10
          situations récurrentes que vous rencontrez dans votre semaine. Pour chacune, décrivez :
        </p>
        <ol>
          <li>La <strong>demande type</strong> telle qu'elle arrive (email, appel, message).</li>
          <li>La <strong>réponse type</strong> que vous donneriez, telle quelle, mots compris.</li>
          <li>Les <strong>variantes possibles</strong> selon le contexte (client pressé, demande sensible…).</li>
        </ol>
        <p>
          Ces cas concrets serviront à votre agent de référence pour répondre à toutes les situations
          similaires qu'il rencontrera ensuite. C'est ce qui fait la différence entre un agent générique
          et un copilote qui parle vraiment comme vous.
        </p>

        <h2>5. Les pièges les plus courants</h2>
        <p>Voici les erreurs que nous voyons le plus souvent chez les professionnels qui se lancent seuls :</p>
        <ul>
          <li><strong>Le brief abstrait.</strong> « Je veux un agent qui m'aide pour mes emails » — sans préciser quel type d'email, à qui, pour quel objectif.</li>
          <li><strong>Les contradictions.</strong> Demander un ton à la fois « formel » et « décontracté » sans préciser dans quel cas.</li>
          <li><strong>L'absence de garde-fous.</strong> Ne pas dire à l'agent ce qu'il <em>ne doit pas</em> faire. Résultat : il prend des libertés qui posent problème.</li>
          <li><strong>Trop d'instructions, pas assez d'exemples.</strong> Un agent apprend mieux de 3 exemples bien commentés que de 30 lignes de consignes.</li>
        </ul>

        <h2>6. Tester et ajuster</h2>
        <p>
          Une fois votre agent reçu, prévoyez <strong>15 minutes de prise en main</strong>. Soumettez-lui une
          de vos demandes types et comparez sa réponse à celle que vous auriez produite. Notez les écarts :
          ton trop formel, vocabulaire imprécis, structure différente. Ces écarts sont la base de votre
          itération suivante. Un bon agent n'est pas figé : il s'affine au fil des semaines.
        </p>

        <div className="article-callout">
          <div className="article-callout-ico">⚡</div>
          <div>
            <strong>Le réflexe gagnant</strong>
            Notez systématiquement les retouches que vous faites à la main sur les premières productions de
            l'agent. Ces retouches sont la liste de courses pour la prochaine version, encore plus précise.
          </div>
        </div>

        <h2>En résumé</h2>
        <p>
          Un bon agent personnalisé n'est pas le résultat d'une instruction magique. C'est le résultat d'un
          cadrage rigoureux : <strong>vos meilleurs exemples, vos règles non-dites, vos cas réels</strong>.
          Quand ces trois piliers sont bien posés, l'agent devient un véritable extension de votre savoir-faire,
          et vous récupérez plusieurs heures par semaine sur des tâches qui vous pesaient.
        </p>
      </div>

      <div className="article-cta">
        <h3>Prêt à passer à l'action ?</h3>
        <p>Notre questionnaire vous guide pour fournir tous les éléments nécessaires à un agent réussi.</p>
        <CtaButton className="btn btn-primary btn-xl">Créer mon agent personnalisé →</CtaButton>
      </div>
    </div>
  );
}
