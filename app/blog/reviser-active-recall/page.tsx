import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Revise half as much, remember twice as much: the proven method — MonAgentPerso",
      description:
        "Rereading your notes is the worst method. Self-testing (active recall) and spaced repetition are proven by research. How to apply them concretely, with a 2-week plan.",
    };
  }
  return {
    title: "Réviser deux fois moins, retenir deux fois plus : la méthode prouvée — MonAgentPerso",
    description:
      "Relire ses cours est la pire méthode. L'auto-test (active recall) et la répétition espacée sont prouvés par la recherche. Comment les appliquer concrètement, avec un plan sur 2 semaines.",
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
          <span className="section-eyebrow">Studies</span>
          <span>· 6 min read</span>
        </div>
        <h1>Revise half as much, remember twice as much</h1>
        <p className="article-lead">
          The most widespread revision method — rereading and highlighting — is also one of the least effective.
          Two techniques, validated by decades of cognitive-science research, do far better in less time:{" "}
          <strong>self-testing</strong> and <strong>spaced repetition</strong>. Here's how to put them into
          practice, concretely.
        </p>

        <div className="article-content">
          <p>
            If you revise by rereading your notes the night before the exam, you're working hard for a weak
            result. The problem isn't your memory: it's the method. Change it, and the same work time pays off far
            more.
          </p>

          <h2>1. Why rereading (almost) doesn't work</h2>
          <p>
            Rereading gives an <strong>illusion of mastery</strong>: the text becomes familiar, so you think you
            know it. But recognizing information (“oh yes, that rings a bell”) isn't the same as{" "}
            <strong>retrieving</strong> it from memory on the day. And retrieving is exactly what you'll be asked to
            do. Highlighting and rereading train recognition, not recall.
          </p>

          <h2>2. The testing effect: testing yourself makes you learn</h2>
          <p>
            This is the most solid result in learning research. In a study that became a reference, students who{" "}
            <strong>tested themselves</strong> on a text retained, a week later, <strong>about 50% more</strong>
            than those who reread it — with <em>less</em> time spent. Forcing yourself to retrieve information
            strengthens the memory trace, whereas passive rereading lets it fade.
          </p>
          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The habit to build</strong>
              After reading a chapter, close it and write (or say out loud) everything you remember. Then check.
              This simple gesture is worth several rereads.
            </div>
          </div>

          <h2>3. Spaced repetition: revising at the right time</h2>
          <p>
            Revising five times in a row the night before (cramming) is less effective than five revisions{" "}
            <strong>spread over time</strong>. That's the spacing effect, confirmed by hundreds of studies. The
            principle: review a concept just before you forget it, at <strong>increasing</strong> intervals.
          </p>
          <p>A simple, effective schedule for a card or a concept:</p>
          <ul>
            <li>Day 0 (learning) → review the <strong>same day</strong></li>
            <li>then at <strong>D+1</strong>, <strong>D+3</strong>, <strong>D+7</strong>, <strong>D+16</strong>, <strong>D+35</strong></li>
          </ul>
          <p>
            Combined with self-testing, spaced repetition can multiply long-term retention by{" "}
            <strong>two to three</strong>. It's the engine of tools like Anki, and the heart of Leitner's “boxes”
            system: a successful card moves to a box reviewed less often; a failed card returns to the start.
          </p>

          <h2>4. Making good flashcards (most are botched)</h2>
          <p>
            An effective flashcard respects the <strong>minimum information principle</strong>: one card ={" "}
            <strong>one single thing</strong> to retrieve, ideally in under 8 seconds.
          </p>
          <p><strong>Bad card</strong> (overloaded):</p>
          <blockquote>
            Front: “The French Revolution” — Back: 5 causes + 3 dates + 2 consequences.
          </blockquote>
          <p><strong>Good cards</strong> (atomic):</p>
          <blockquote>
            “In what year does the French Revolution begin?” → “1789”<br />
            “What event marks July 14, 1789?” → “The storming of the Bastille”
          </blockquote>
          <p>Three rules that make the difference:</p>
          <ul>
            <li><strong>A precise question</strong>: a vague cue brings back too many possible answers, and recall fails.</li>
            <li><strong>The cloze deletion</strong> is fast to create and devastatingly effective: “The mitochondrion produces {"{…ATP…}"} ”.</li>
            <li><strong>Avoid raw lists</strong>: turn them into separate cards or an ordered enumeration — unordered sets are very hard to memorize.</li>
          </ul>

          <h2>5. Two bonus techniques, no materials</h2>
          <ul>
            <li><strong>The Cornell method</strong>: split the page into three (keywords / notes / summary). The left column becomes a series of <em>questions</em> to self-test.</li>
            <li><strong>The Feynman technique</strong>: explain the concept out loud, as if to a child. Where you get stuck is precisely what you haven't understood.</li>
          </ul>

          <h2>6. A concrete two-week plan</h2>
          <ul>
            <li><strong>Days 1-3</strong> — Learn the material in blocks. After each block: close everything, recall from memory, create 5 to 10 atomic flashcards.</li>
            <li><strong>Every day</strong> — 15 minutes of self-testing on the cards “due” that day (per the intervals above). Failed cards → start over sooner.</li>
            <li><strong>Days 7 and 12</strong> — A mock test without notes, then Feynman on the weak points.</li>
            <li><strong>The day before</strong> — No cramming: a quick review of only the still-hard cards, then to bed.</li>
          </ul>
          <div className="article-callout">
            <div className="article-callout-ico">⚡</div>
            <div>
              <strong>Learn first, memorize after</strong>
              Flashcards train knowledge that's <em>already understood</em> — they aren't tools for learning a
              concept for the first time. Understand, then anchor.
            </div>
          </div>

          <h2>In short</h2>
          <p>
            Stop rereading. <strong>Test yourself</strong> (testing effect) and <strong>space</strong> your
            revisions (spaced repetition): these two techniques, combined, are the only ones rated “high utility”
            by research. Atomic flashcards, a schedule of increasing intervals, and a bit of Feynman for the hard
            points: you'll remember more, for longer, while working less.
          </p>
        </div>

        <div className="article-cta">
          <h3>Turn your courses into flashcards and quizzes</h3>
          <p>
            Our Flashcards &amp; Quizzes agent generates, from your documents, atomic cards and quizzes ready for
            self-testing and spaced repetition. Unlock it for €4.90.
          </p>
          <Link href="/agents-gpt" className="btn btn-primary btn-xl">See the Flashcards &amp; Quizzes agent →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Études</span>
        <span>· 6 min de lecture</span>
      </div>
      <h1>Réviser deux fois moins, retenir deux fois plus</h1>
      <p className="article-lead">
        La méthode de révision la plus répandue — relire et surligner — est aussi l'une des moins
        efficaces. Deux techniques, validées par des décennies de recherche en sciences cognitives, font
        beaucoup mieux en moins de temps : l'<strong>auto-test</strong> et la <strong>répétition
        espacée</strong>. Voici comment les mettre en pratique, concrètement.
      </p>

      <div className="article-content">
        <p>
          Si vous révisez en relisant vos notes la veille de l'examen, vous travaillez dur pour un
          résultat faible. Le problème n'est pas votre mémoire : c'est la méthode. Changez-en, et le même
          temps de travail rapporte beaucoup plus.
        </p>

        <h2>1. Pourquoi relire ne marche (presque) pas</h2>
        <p>
          Relire donne une <strong>illusion de maîtrise</strong> : le texte devient familier, donc on
          croit le savoir. Mais reconnaître une information (« ah oui, ça me dit quelque chose ») n'est
          pas la même chose que la <strong>retrouver</strong> de mémoire le jour J. Or c'est bien retrouver
          qu'on vous demandera. Surligner et relire entraînent la reconnaissance, pas la restitution.
        </p>

        <h2>2. L'effet de test : se tester fait apprendre</h2>
        <p>
          C'est le résultat le plus solide de la recherche sur l'apprentissage. Dans une étude devenue
          référence, des étudiants qui <strong>se testaient</strong> sur un texte retenaient, une semaine
          plus tard, <strong>environ 50 % de plus</strong> que ceux qui le relisaient — avec <em>moins</em>
          de temps passé. Se forcer à récupérer l'information renforce la trace en mémoire, alors que la
          relecture passive la laisse s'effacer.
        </p>
        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>Le réflexe à prendre</strong>
            Après avoir lu un chapitre, fermez-le et écrivez (ou dites à voix haute) tout ce dont vous
            vous souvenez. Puis vérifiez. Ce simple geste vaut plusieurs relectures.
          </div>
        </div>

        <h2>3. La répétition espacée : réviser au bon moment</h2>
        <p>
          Réviser cinq fois d'affilée la veille (bachotage) est moins efficace que cinq révisions{" "}
          <strong>réparties dans le temps</strong>. C'est l'effet d'espacement, confirmé par des centaines
          d'études. Le principe : revoir une notion juste avant de l'oublier, à intervalles{" "}
          <strong>croissants</strong>.
        </p>
        <p>Un planning simple et efficace pour une carte ou une notion :</p>
        <ul>
          <li>Jour 0 (apprentissage) → révision le <strong>jour même</strong></li>
          <li>puis à <strong>J+1</strong>, <strong>J+3</strong>, <strong>J+7</strong>, <strong>J+16</strong>, <strong>J+35</strong></li>
        </ul>
        <p>
          Combinée à l'auto-test, la répétition espacée peut multiplier la rétention à long terme par{" "}
          <strong>deux à trois</strong>. C'est le moteur d'outils comme Anki, et le cœur du système de
          « boîtes » de Leitner : une carte réussie passe dans une boîte révisée moins souvent ; une carte
          ratée revient au début.
        </p>

        <h2>4. Fabriquer de bonnes flashcards (la plupart sont ratées)</h2>
        <p>
          Une flashcard efficace respecte le <strong>principe d'information minimale</strong> : une carte
          = <strong>une seule chose</strong> à retrouver, idéalement en moins de 8 secondes.
        </p>
        <p><strong>Mauvaise carte</strong> (trop chargée) :</p>
        <blockquote>
          Recto : « La Révolution française » — Verso : 5 causes + 3 dates + 2 conséquences.
        </blockquote>
        <p><strong>Bonnes cartes</strong> (atomiques) :</p>
        <blockquote>
          « En quelle année débute la Révolution française ? » → « 1789 »<br />
          « Quel événement marque le 14 juillet 1789 ? » → « La prise de la Bastille »
        </blockquote>
        <p>Trois règles qui font la différence :</p>
        <ul>
          <li><strong>Une question précise</strong> : un indice vague ramène trop de réponses possibles, et le rappel échoue.</li>
          <li><strong>Le texte à trou (cloze)</strong> est rapide à créer et redoutablement efficace : « La mitochondrie produit l'{"{…ATP…}"} ».</li>
          <li><strong>Évitez les listes brutes</strong> : transformez-les en cartes séparées ou en énumération ordonnée — les ensembles non ordonnés sont très durs à mémoriser.</li>
        </ul>

        <h2>5. Deux techniques bonus, sans matériel</h2>
        <ul>
          <li><strong>La méthode Cornell</strong> : divisez la page en trois (mots-clés / notes / résumé). La colonne de gauche devient une série de <em>questions</em> pour vous auto-tester.</li>
          <li><strong>La technique Feynman</strong> : expliquez la notion à voix haute, comme à un enfant. Là où vous bloquez, c'est précisément ce que vous n'avez pas compris.</li>
        </ul>

        <h2>6. Un plan concret sur deux semaines</h2>
        <ul>
          <li><strong>Jours 1-3</strong> — Apprenez le cours par blocs. Après chaque bloc : fermez tout, restituez de mémoire, créez 5 à 10 flashcards atomiques.</li>
          <li><strong>Chaque jour</strong> — 15 minutes d'auto-test sur les cartes « dues » du jour (selon les intervalles ci-dessus). Cartes ratées → on recommence plus tôt.</li>
          <li><strong>Jours 7 et 12</strong> — Un test « blanc » sans notes, puis Feynman sur les points faibles.</li>
          <li><strong>Veille</strong> — Pas de bachotage : une révision rapide des seules cartes encore difficiles, et au lit.</li>
        </ul>
        <div className="article-callout">
          <div className="article-callout-ico">⚡</div>
          <div>
            <strong>Apprendre d'abord, mémoriser ensuite</strong>
            Les flashcards entraînent un savoir <em>déjà compris</em> — ce ne sont pas des outils pour
            apprendre une notion la première fois. Comprenez, puis ancrez.
          </div>
        </div>

        <h2>En résumé</h2>
        <p>
          Arrêtez de relire. <strong>Testez-vous</strong> (effet de test) et <strong>espacez</strong> vos
          révisions (répétition espacée) : ces deux techniques, combinées, sont les seules classées « haute
          utilité » par la recherche. Des flashcards atomiques, un planning d'intervalles croissants, et un
          peu de Feynman pour les points durs : vous retiendrez davantage, plus longtemps, en travaillant
          moins.
        </p>
      </div>

      <div className="article-cta">
        <h3>Transformez vos cours en flashcards et quiz</h3>
        <p>
          Notre agent Fiches &amp; Quiz génère, à partir de vos documents, des cartes atomiques et des
          quiz prêts pour l'auto-test et la répétition espacée. À débloquer pour 4,90 €.
        </p>
        <Link href="/agents-gpt" className="btn btn-primary btn-xl">Voir l'agent Fiches &amp; Quiz →</Link>
      </div>
    </div>
  );
}
