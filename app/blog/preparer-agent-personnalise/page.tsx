import Link from "next/link";
import CtaButton from "@/components/CtaButton";

export const metadata = {
  title: "Comment préparer un bon agent personnalisé — MonAgentPerso",
  description:
    "Méthode complète pour cadrer votre agent IA : exemples, règles, cas concrets. Évitez les pièges et gagnez du temps dès la première utilisation.",
};

export default function ArticlePage() {
  return (
    <div className="container article">
      <Link href="/blog" className="article-back">← Tous les articles</Link>
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
