import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Making AI write without it showing: what detectors really catch — MonAgentPerso",
      description:
        "Perplexity, burstiness, language tics: understand what AI detectors really spot, and 7 concrete tweaks for a natural text — without sacrificing meaning.",
    };
  }
  return {
    title: "Faire écrire l'IA sans que ça se voie : ce que détectent vraiment les détecteurs — MonAgentPerso",
    description:
      "Perplexité, burstiness, tics de langage : comprenez ce que repèrent réellement les détecteurs d'IA, et 7 réglages concrets pour un texte naturel — sans sacrifier le sens.",
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
          <span className="section-eyebrow">Deep dive</span>
          <span>· 7 min read</span>
        </div>
        <h1>Making AI write without it showing</h1>
        <p className="article-lead">
          AI-generated text gets spotted. Not by magic: through precise statistical signals and an overly
          predictable vocabulary. Good news, these signals can be fixed. Here's what detectors (GPTZero,
          Originality, Turnitin…) really measure and 7 concrete tweaks to make a text natural — without changing
          its meaning or slipping in mistakes.
        </p>

        <div className="article-content">
          <p>
            First, an honest clarification: “humanizing” isn't cheating, it's <strong>rewriting</strong> so the
            text reads as if a human thought it through. Most AI outputs ring false because they're too smooth, too
            regular, and packed with the same turns of phrase. Fix that, and the text comes alive again.
          </p>

          <h2>1. The two signals detectors (really) measure</h2>
          <p>Beyond the marketing, almost all detectors rely on two simple measures.</p>

          <h3>Perplexity: how predictable the text is</h3>
          <p>
            An AI picks, at each word, the most likely one. The result: a fluid but <strong>ultra-predictable</strong>
            text, hence <em>low perplexity</em>. Humans make more unexpected choices. Compare:
          </p>
          <ul>
            <li><em>“The sky is blue and the weather is nice.”</em> → totally predictable.</li>
            <li><em>“The sky brooded over a rain that never fell.”</em> → unpredictable, hence “human”.</li>
          </ul>

          <h3>Variability (burstiness): the rhythm of sentences</h3>
          <p>
            Humans write in bursts: one long, winding sentence, then a short one. Curt. AI, on the other hand,
            lines up medium-length sentences, all built the same way. This overly regular rhythm is signal #2.
            Simply <strong>varying sentence length strongly</strong> is often enough to drop the “AI” score.
          </p>

          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The golden rule</strong>
              It all comes down to two levers: choosing <em>less expected</em> words (perplexity) and{" "}
              <em>breaking the rhythm</em> of sentences (burstiness). The rest is cleanup.
            </div>
          </div>

          <h2>2. The tics that give away an AI text (in English)</h2>
          <p>
            Models overuse certain words and phrases. Spotting them is an immediate signal — for a detector as for
            an attentive reader. To hunt down and replace:
          </p>
          <ul>
            <li><strong>Catch-all adjectives</strong>: “crucial”, “essential”, “must-have”, “fascinating”, “rich”, “revolutionary”.</li>
            <li><strong>Hollow phrases</strong>: “it's worth noting that”, “in today's world”, “in the era of”, “at the end of the day”, “delve into”.</li>
            <li><strong>Connectors in a row</strong>: “Moreover… Furthermore… In addition… In conclusion…”.</li>
            <li><strong>The em dash (—) on repeat</strong>: a surprisingly strong marker of AI writing.</li>
          </ul>
          <p>
            And an invisible trap: copy-pasting from an AI sometimes carries <strong>invisible Unicode
            characters</strong> (zero-width spaces). Invisible to the eye, detectable by script. Retyping the text
            clean removes them.
          </p>

          <h2>3. The 7 concrete tweaks</h2>
          <ol>
            <li><strong>Vary sentence length.</strong> Alternate 5 words and 30 words. A short idea. Then a broad development with asides.</li>
            <li><strong>Banish the tics above.</strong> Replace “it's crucial to” with a direct verb; delete the “In conclusion”s.</li>
            <li><strong>Prefer the concrete to the abstract.</strong> “We improved performance” → “Load time dropped from 4s to 1.2s”.</li>
            <li><strong>Vary sentence beginnings.</strong> If three sentences in a row start with the subject, reorganize one.</li>
            <li><strong>Add a voice.</strong> An opinion, a lived example, a question — depending on the register. That's what an AI doesn't do spontaneously.</li>
            <li><strong>Lighten typographic punctuation.</strong> Replace superfluous em dashes with commas or periods.</li>
            <li><strong>Clean the text.</strong> Paste it back as plain text to purge invisible characters, then restore the formatting.</li>
          </ol>

          <h2>4. Before / after</h2>
          <p><strong>Before (typically AI):</strong></p>
          <blockquote>
            “In today's world, it's crucial to understand that digital marketing plays an essential role.
            Moreover, it's important to note that companies must absolutely adapt. In conclusion, it's a must-have
            lever.”
          </blockquote>
          <p><strong>After (humanized, same meaning):</strong></p>
          <blockquote>
            “Digital marketing carries real weight today. Companies that don't get on board pay for it — often
            without understanding why their sales stall. In short, it's no longer optional.”
          </blockquote>
          <p>
            Notice what changed: broken rhythm, tics removed, concrete vocabulary, a hint of voice. The meaning,
            though, is intact.
          </p>

          <div className="article-callout">
            <div className="article-callout-ico">⚠</div>
            <div>
              <strong>The mistake never to make</strong>
              <em>Never</em> slip in errors “to seem human”. A faulty text isn't human, it's bad — and penalized
              everywhere. You humanize through style and precision, not through error.
            </div>
          </div>

          <h2>5. The limits (worth knowing)</h2>
          <ul>
            <li><strong>No tool is 100% reliable.</strong> Detectors evolve; a “clean” text today can be flagged tomorrow. Beware of absolute promises.</li>
            <li><strong>False positives exist.</strong> Fully human texts (very tidy writers, non-natives) are sometimes flagged. Detection is a probability, not a proof.</li>
            <li><strong>Under ~150 words</strong>, both detection and humanization are unreliable.</li>
            <li><strong>Ethics matter.</strong> Humanizing an article, pro content or a draft, yes. Cheating a proctored exam or a certification, no. Aim for quality, not concealment.</li>
          </ul>

          <h2>In short</h2>
          <p>
            Detectors rely on two signals: <strong>perplexity</strong> (text too predictable) and{" "}
            <strong>burstiness</strong> (sentences too regular). For a natural text: vary the rhythm, banish the
            English tics, prefer the concrete, add a voice and clean invisible characters. All without ever
            touching the meaning or the spelling. Done well, it's not cheating: it's simply{" "}
            <strong>writing better</strong>.
          </p>
        </div>

        <div className="article-cta">
          <h3>Save time with a dedicated agent</h3>
          <p>
            Our Humanizer agent applies all this automatically — tic lists, rhythm, cleanup — keeping your meaning
            and your register. Unlock it for €4.90.
          </p>
          <Link href="/agents-gpt" className="btn btn-primary btn-xl">See the Humanizer agent →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
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
