import Link from "next/link";

export const metadata = {
  title: "Faire écrire l'IA sans que ça se voie : ce que détectent vraiment les détecteurs — MonAgentPerso",
  description:
    "Perplexité, burstiness, tics de langage : comprenez ce que repèrent réellement les détecteurs d'IA, et 7 réglages concrets pour un texte naturel — sans sacrifier le sens.",
};

export default function ArticlePage() {
  return (
    <div className="container article">
      <Link href="/blog" className="article-back">← Tous les articles</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Décryptage</span>
        <span>· 7 min de lecture</span>
      </div>
      <h1>Faire écrire l'IA sans que ça se voie</h1>
      <p className="article-lead">
        Un texte généré par IA se repère. Pas par magie : par des signaux statistiques précis et un
        vocabulaire trop prévisible. Bonne nouvelle, ces signaux se corrigent. Voici ce que mesurent
        réellement les détecteurs (GPTZero, Originality, Compilatio…) et 7 réglages concrets pour rendre
        un texte naturel — sans en changer le sens ni y glisser de fautes.
      </p>

      <div className="article-content">
        <p>
          D'abord, une mise au point honnête : « humaniser », ce n'est pas tricher, c'est{" "}
          <strong>réécrire</strong> pour que le texte se lise comme s'il avait été pensé par un humain.
          La plupart des sorties d'IA sonnent faux parce qu'elles sont trop lisses, trop régulières, et
          truffées des mêmes tournures. Corrigez ça, et le texte redevient vivant.
        </p>

        <h2>1. Les deux signaux que mesurent (vraiment) les détecteurs</h2>
        <p>Au-delà du marketing, presque tous les détecteurs s'appuient sur deux mesures simples.</p>

        <h3>La perplexité : à quel point le texte est prévisible</h3>
        <p>
          Une IA choisit, à chaque mot, le plus probable. Résultat : un texte fluide mais{" "}
          <strong>ultra-prévisible</strong>, donc à <em>perplexité basse</em>. L'humain fait des choix
          plus inattendus. Comparez :
        </p>
        <ul>
          <li><em>« Le ciel est bleu et le temps est agréable. »</em> → totalement prévisible.</li>
          <li><em>« Le ciel ruminait une pluie qui n'est jamais tombée. »</em> → imprévisible, donc « humain ».</li>
        </ul>

        <h3>La variabilité (burstiness) : le rythme des phrases</h3>
        <p>
          L'humain écrit par à-coups : une longue phrase sinueuse, puis une courte. Sèche. L'IA, elle,
          aligne des phrases de longueur moyenne, toutes bâties pareil. Ce rythme trop régulier est le
          signal n°2. Le simple fait de <strong>varier fortement la longueur des phrases</strong> suffit
          souvent à faire chuter le score « IA ».
        </p>

        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>La règle d'or</strong>
            Tout se joue sur deux leviers : choisir des mots <em>moins attendus</em> (perplexité) et{" "}
            <em>casser le rythme</em> des phrases (burstiness). Le reste, c'est du nettoyage.
          </div>
        </div>

        <h2>2. Les tics qui trahissent un texte IA (en français)</h2>
        <p>
          Les modèles sur-emploient certains mots et formules. Les voir, c'est un signal immédiat — pour
          un détecteur comme pour un lecteur attentif. À traquer et remplacer :
        </p>
        <ul>
          <li><strong>Adjectifs passe-partout</strong> : « crucial », « essentiel », « incontournable », « fascinant », « riche », « révolutionnaire ».</li>
          <li><strong>Formules creuses</strong> : « il convient de noter que », « force est de constater », « dans le monde actuel », « à l'ère de », « en somme ».</li>
          <li><strong>Connecteurs en série</strong> : « De plus… Par ailleurs… En outre… En conclusion… ».</li>
          <li><strong>Le tiret cadratin (—) à répétition</strong> : marqueur étonnamment fort d'écriture IA.</li>
        </ul>
        <p>
          Et un piège invisible : le copier-coller depuis une IA embarque parfois des{" "}
          <strong>caractères Unicode invisibles</strong> (espaces de largeur nulle). Invisibles à l'œil,
          détectables par script. Repasser le texte au propre les élimine.
        </p>

        <h2>3. Les 7 réglages concrets</h2>
        <ol>
          <li><strong>Variez la longueur des phrases.</strong> Alternez 5 mots et 30 mots. Une idée courte. Puis un développement ample avec des incises.</li>
          <li><strong>Bannissez les tics ci-dessus.</strong> Remplacez « il est crucial de » par un verbe direct ; supprimez les « En conclusion ».</li>
          <li><strong>Préférez le concret à l'abstrait.</strong> « Nous avons amélioré la performance » → « Le temps de chargement est passé de 4 s à 1,2 s ».</li>
          <li><strong>Variez les débuts de phrase.</strong> Si trois phrases d'affilée commencent par le sujet, réorganisez-en une.</li>
          <li><strong>Ajoutez une voix.</strong> Une opinion, un exemple vécu, une question — selon le registre. C'est ce qu'une IA ne fait pas spontanément.</li>
          <li><strong>Allégez la ponctuation typographique.</strong> Remplacez les tirets cadratins superflus par des virgules ou des points.</li>
          <li><strong>Nettoyez le texte.</strong> Recollez-le en texte brut pour purger les caractères invisibles, puis remettez la mise en forme.</li>
        </ol>

        <h2>4. Avant / après</h2>
        <p><strong>Avant (typiquement IA) :</strong></p>
        <blockquote>
          « Dans le monde actuel, il est crucial de comprendre que le marketing digital joue un rôle
          essentiel. De plus, il est important de noter que les entreprises doivent impérativement
          s'adapter. En conclusion, c'est un levier incontournable. »
        </blockquote>
        <p><strong>Après (humanisé, même sens) :</strong></p>
        <blockquote>
          « Le marketing digital, aujourd'hui, pèse lourd. Les entreprises qui ne s'y mettent pas le
          paient — souvent sans comprendre pourquoi leurs ventes stagnent. Bref, ce n'est plus une
          option. »
        </blockquote>
        <p>
          Notez ce qui a changé : rythme cassé, tics supprimés, vocabulaire concret, une pointe de voix.
          Le sens, lui, est intact.
        </p>

        <div className="article-callout">
          <div className="article-callout-ico">⚠</div>
          <div>
            <strong>L'erreur à ne jamais commettre</strong>
            Ne glissez <em>jamais</em> de fautes « pour faire humain ». Un texte fautif n'est pas humain,
            il est mauvais — et pénalisé partout. On humanise par le style et la précision, pas par l'erreur.
          </div>
        </div>

        <h2>5. Les limites (à connaître)</h2>
        <ul>
          <li><strong>Aucun outil n'est fiable à 100 %.</strong> Les détecteurs évoluent ; un texte « propre » aujourd'hui peut être flaggé demain. Méfiez-vous des promesses absolues.</li>
          <li><strong>Les faux positifs existent.</strong> Des textes 100 % humains (rédacteurs très carrés, non-natifs) sont parfois signalés. La détection est une probabilité, pas une preuve.</li>
          <li><strong>Sous ~150 mots</strong>, détection comme humanisation sont peu fiables.</li>
          <li><strong>L'éthique compte.</strong> Humaniser un article, un contenu pro ou un brouillon, oui. Tromper un examen surveillé ou une attestation, non. Visez la qualité, pas la dissimulation.</li>
        </ul>

        <h2>En résumé</h2>
        <p>
          Les détecteurs reposent sur deux signaux : <strong>perplexité</strong> (texte trop prévisible)
          et <strong>burstiness</strong> (phrases trop régulières). Pour un texte naturel : variez le
          rythme, bannissez les tics français, préférez le concret, ajoutez une voix et nettoyez les
          caractères invisibles. Le tout sans jamais toucher au sens ni à l'orthographe. Bien fait, ce
          n'est pas de la triche : c'est simplement <strong>mieux écrire</strong>.
        </p>
      </div>

      <div className="article-cta">
        <h3>Gagnez du temps avec un agent dédié</h3>
        <p>
          Notre agent Humanizer applique tout cela automatiquement — listes de tics, rythme, nettoyage —
          en gardant votre sens et votre registre. À débloquer pour 4,90 €.
        </p>
        <Link href="/agents-gpt" className="btn btn-primary btn-xl">Voir l'agent Humanizer →</Link>
      </div>
    </div>
  );
}
