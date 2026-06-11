import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Writing a prompt that works: the 6-block method — MonAgentPerso",
      description:
        "Stop improvising your prompts. The 6-block method (role, context, task, format, constraints, examples) + few-shot and reasoning, with a concrete before/after.",
    };
  }
  return {
    title: "Écrire un prompt qui marche : la méthode des 6 blocs — MonAgentPerso",
    description:
      "Arrêtez d'improviser vos prompts. La méthode des 6 blocs (rôle, contexte, tâche, format, contraintes, exemples) + few-shot et raisonnement, avec un avant/après concret.",
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
          <span className="section-eyebrow">Method</span>
          <span>· 7 min read</span>
        </div>
        <h1>Writing a prompt that works: the 6-block method</h1>
        <p className="article-lead">
          90% of failed prompts fail for one reason: they're vague. “Write me a LinkedIn post about AI” gives
          generic mush because you gave nothing to aim at. Here's the exact structure pros use to get a usable
          result on the first try — plus the 3 techniques that change everything when added at the right moment.
        </p>

        <div className="article-content">
          <p>
            A good prompt isn't a magic formula: it's a <strong>spec sheet</strong>. The more precisely the AI
            knows what you expect, the less it invents. The good news is that all effective prompts contain the
            same six bricks. Learn them once, reuse them everywhere.
          </p>

          <h2>1. The 6 blocks of an effective prompt</h2>
          <p>
            Whatever the trendy acronym (RTF, COSTAR, CRISPE…): they all describe the same thing. Here are the six
            blocks, in a logical order.
          </p>
          <ul>
            <li><strong>Role</strong> — who the AI should embody. “You are a senior tech recruiter.” This frames the vocabulary and the level of expectation.</li>
            <li><strong>Context</strong> — the useful background: for whom, for what purpose, what project constraints.</li>
            <li><strong>Task</strong> — the precise action, phrased with a verb: “write”, “compare”, “correct”, “classify”.</li>
            <li><strong>Output format</strong> — the expected shape: “table”, “5 bullets”, “JSON”, “280 characters max”.</li>
            <li><strong>Constraints</strong> — the tone, the length, the no-gos: “no jargon”, “formal address”, “don't invent any figures”.</li>
            <li><strong>Examples</strong> — one or two illustrations of the desired result (we'll come back to it, it's the secret weapon).</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The forgetting test</strong>
              Reread your prompt and ask: “If I handed this to an intern who doesn't know me, could they manage?”
              If the format or context is missing, the AI will flounder too.
            </div>
          </div>

          <h2>2. Before / after: same need, two results</h2>
          <p>Take a real case: a LinkedIn post.</p>
          <p><strong>Weak prompt:</strong> “Write a LinkedIn post about remote work.”</p>
          <p><strong>Structured prompt:</strong></p>
          <blockquote>
            Role: you are a B2B LinkedIn ghostwriter.<br />
            Context: audience = SME executives, not very tech-savvy.<br />
            Task: write a post on the hidden costs of badly organized remote work.<br />
            Constraints: 130-170 words, expert but accessible tone, a hook of fewer than 10 words on the first
            line, a single strong idea, a closing question, zero hollow buzzwords.<br />
            Format: ready-to-publish text, airy paragraphs.<br />
            Example of expected hook: “I scrapped our Monday meetings.”
          </blockquote>
          <p>
            The second prompt leaves no gray area. The result: a text usable right away, instead of a generic
            draft to rework for ten minutes.
          </p>

          <h2>3. The 3 techniques that make the difference</h2>

          <h3>Examples (few-shot): show, don't describe</h3>
          <p>
            This is the most underrated lever. Rather than <em>describing</em> the desired style, <em>show</em> it
            with 1 to 3 “input → output” examples. The AI imitates what it sees far better than what you explain.
            To frame a client-reply format, paste two real replies you've already sent: the AI will mirror your
            tone instantly.
          </p>

          <h3>Step-by-step reasoning: for logic and calculations</h3>
          <p>
            On a task that requires reasoning (analysis, comparison, calculation, argued choice), simply add:{" "}
            <strong>“Reason step by step before concluding.”</strong> Accuracy rises noticeably, because you force
            the AI to lay out its logic instead of jumping to an answer. Conversely, on a simple creative task,
            it's useless — don't put it everywhere.
          </p>

          <h3>Decomposition: one task at a time</h3>
          <p>
            The classic mistake: “Summarize this article, propose a title, write a tweet and generate an image.”
            The AI dilutes its attention and botches it. Break it down: ask for the summary, validate, then move
            on. One prompt = one clear objective.
          </p>

          <h2>4. Turn your good prompts into reusable templates</h2>
          <p>
            As soon as a prompt works, stop rewriting it: <strong>parameterize it</strong>. Replace the parts that
            change with readable fields in braces.
          </p>
          <blockquote>
            You are {"{role}"}. Write {"{deliverable}"} for {"{audience}"}.<br />
            Topic: {"{topic}"}. Tone: {"{tone}"}. Length: {"{length}"}. Format: {"{format}"}.
          </blockquote>
          <p>
            You keep a single template and change the values as needed. Avoid cryptic names
            (<code>{"{x}"}</code>, <code>{"{thing}"}</code>): a readable template gets reused and shared.
          </p>

          <h2>5. Adapt to the model you use</h2>
          <ul>
            <li><strong>Claude</strong> makes remarkable use of <strong>tags</strong> like <code>&lt;context&gt;…&lt;/context&gt;</code> to separate blocks, and accepts long, detailed instructions.</li>
            <li><strong>ChatGPT</strong> prefers <strong>structured, concise</strong> instructions: role + imposed format + one example.</li>
            <li>In all cases: <strong>structure (lists, sections) beats a wall of text.</strong></li>
          </ul>

          <h2>6. The 5 mistakes that sink a prompt</h2>
          <ul>
            <li><strong>Vagueness</strong> (“help me with my marketing”): no target.</li>
            <li><strong>No imposed format</strong>: the answer goes all over the place.</li>
            <li><strong>No example</strong>: bland, “recognizably AI” style.</li>
            <li><strong>Overload</strong>: three tasks in a single prompt.</li>
            <li><strong>Implicit constraints</strong>: you expected 100 words, you get 600. Say so.</li>
          </ul>

          <div className="article-callout">
            <div className="article-callout-ico">⚡</div>
            <div>
              <strong>The winning reflex</strong>
              The perfect first-try prompt doesn't exist. Launch a structured v1, see what's off, adjust <em>one</em>
              block at a time. Three iterations are almost always enough.
            </div>
          </div>

          <h2>In short</h2>
          <p>
            An effective prompt holds in six blocks: <strong>role, context, task, format, constraints,
            examples</strong>. Add <strong>examples</strong> to frame the style, <strong>step-by-step
            reasoning</strong> for logic, and <strong>decompose</strong> complex tasks. Parameterize what works,
            adapt to the model, and iterate. You'll go from “correct answers” to “directly usable answers” — which
            is exactly the difference between a generic ChatGPT and a well-designed agent.
          </p>
        </div>

        <div className="article-cta">
          <h3>Don't feel like crafting your prompts by hand?</h3>
          <p>
            Our ready-to-use agents already embed these methods — including a prompt generator. Unlock it for
            €4.90 in the marketplace.
          </p>
          <Link href="/agents-gpt" className="btn btn-primary btn-xl">See the ready-to-use agents →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Méthode</span>
        <span>· 7 min de lecture</span>
      </div>
      <h1>Écrire un prompt qui marche : la méthode des 6 blocs</h1>
      <p className="article-lead">
        90 % des prompts ratés le sont pour une seule raison : ils sont vagues. « Écris-moi un post
        LinkedIn sur l'IA » donne une bouillie générique parce que vous n'avez rien donné à viser. Voici
        la structure exacte que les pros utilisent pour obtenir, du premier coup, un résultat exploitable
        — et les 3 techniques qui changent tout quand on les ajoute au bon moment.
      </p>

      <div className="article-content">
        <p>
          Un bon prompt n'est pas une formule magique : c'est un <strong>cahier des charges</strong>.
          Plus l'IA sait précisément ce que vous attendez, moins elle invente. La bonne nouvelle, c'est
          que tous les prompts efficaces contiennent les mêmes six briques. Apprenez-les une fois, vous
          les réutiliserez partout.
        </p>

        <h2>1. Les 6 blocs d'un prompt efficace</h2>
        <p>
          Peu importe l'acronyme à la mode (RTF, COSTAR, CRISPE…) : ils décrivent tous la même chose.
          Voici les six blocs, dans un ordre logique.
        </p>
        <ul>
          <li><strong>Rôle</strong> — qui l'IA doit incarner. « Tu es un recruteur tech senior. » Cela cadre le vocabulaire et le niveau d'exigence.</li>
          <li><strong>Contexte</strong> — l'arrière-plan utile : pour qui, dans quel but, quelles contraintes du projet.</li>
          <li><strong>Tâche</strong> — l'action précise, formulée avec un verbe : « rédige », « compare », « corrige », « classe ».</li>
          <li><strong>Format de sortie</strong> — la forme attendue : « tableau », « 5 puces », « JSON », « 280 caractères max ».</li>
          <li><strong>Contraintes</strong> — le ton, la longueur, les interdits : « pas de jargon », « vouvoiement », « n'invente aucun chiffre ».</li>
          <li><strong>Exemples</strong> — une ou deux illustrations du résultat voulu (on y revient, c'est l'arme secrète).</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>Le test de l'oubli</strong>
            Relisez votre prompt et demandez-vous : « Si je donnais ça à un stagiaire qui ne me connaît
            pas, pourrait-il s'en sortir ? » S'il manque le format ou le contexte, l'IA aussi pataugera.
          </div>
        </div>

        <h2>2. Avant / après : le même besoin, deux résultats</h2>
        <p>Prenons un cas réel : un post LinkedIn.</p>
        <p><strong>Prompt faible :</strong> « Écris un post LinkedIn sur le télétravail. »</p>
        <p><strong>Prompt structuré :</strong></p>
        <blockquote>
          Rôle : tu es ghostwriter LinkedIn B2B.<br />
          Contexte : audience = dirigeants de PME, peu technophiles.<br />
          Tâche : rédige un post sur les coûts cachés du télétravail mal organisé.<br />
          Contraintes : 130-170 mots, ton expert mais accessible, accroche de moins de 10 mots en
          première ligne, une seule idée forte, une question finale, zéro buzzword creux.<br />
          Format : texte prêt à publier, paragraphes aérés.<br />
          Exemple d'accroche attendue : « J'ai supprimé nos réunions du lundi. »
        </blockquote>
        <p>
          Le second prompt ne laisse aucune zone grise. Résultat : un texte utilisable tout de suite,
          au lieu d'un brouillon générique à retravailler pendant dix minutes.
        </p>

        <h2>3. Les 3 techniques qui font la différence</h2>

        <h3>Les exemples (few-shot) : montrez, ne décrivez pas</h3>
        <p>
          C'est le levier le plus sous-estimé. Plutôt que de <em>décrire</em> le style voulu, <em>montrez</em>-le
          avec 1 à 3 exemples « entrée → sortie ». L'IA imite ce qu'elle voit bien mieux que ce qu'on lui
          explique. Pour cadrer un format de réponse client, collez deux vraies réponses que vous avez déjà
          envoyées : l'IA calquera votre ton instantanément.
        </p>

        <h3>Le raisonnement pas à pas : pour la logique et les calculs</h3>
        <p>
          Sur une tâche qui demande de raisonner (analyse, comparaison, calcul, choix argumenté), ajoutez
          simplement : <strong>« Raisonne étape par étape avant de conclure. »</strong> La précision grimpe
          nettement, parce que vous forcez l'IA à dérouler sa logique au lieu de sauter à une réponse. À
          l'inverse, sur une tâche créative simple, c'est inutile — n'en mettez pas partout.
        </p>

        <h3>La décomposition : une tâche à la fois</h3>
        <p>
          L'erreur classique : « Résume cet article, propose un titre, écris un tweet et génère une image. »
          L'IA dilue son attention et bâcle. Découpez : demandez le résumé, validez, puis enchaînez.
          Un prompt = un objectif clair.
        </p>

        <h2>4. Transformez vos bons prompts en modèles réutilisables</h2>
        <p>
          Dès qu'un prompt fonctionne, ne le réécrivez plus : <strong>variabilisez-le</strong>. Remplacez
          les parties qui changent par des champs lisibles entre accolades.
        </p>
        <blockquote>
          Tu es {"{role}"}. Rédige {"{livrable}"} pour {"{audience}"}.<br />
          Sujet : {"{sujet}"}. Ton : {"{ton}"}. Longueur : {"{longueur}"}. Format : {"{format}"}.
        </blockquote>
        <p>
          Vous gardez un seul gabarit et vous changez les valeurs au besoin. Évitez les noms cryptiques
          (<code>{"{x}"}</code>, <code>{"{truc}"}</code>) : un modèle lisible se réutilise et se partage.
        </p>

        <h2>5. Adaptez au modèle que vous utilisez</h2>
        <ul>
          <li><strong>Claude</strong> exploite remarquablement les <strong>balises</strong> du type <code>&lt;contexte&gt;…&lt;/contexte&gt;</code> pour séparer les blocs, et accepte des instructions longues et détaillées.</li>
          <li><strong>ChatGPT</strong> préfère des instructions <strong>structurées et concises</strong> : rôle + format imposé + un exemple.</li>
          <li>Dans tous les cas : <strong>la structure (listes, sections) bat le pavé de texte.</strong></li>
        </ul>

        <h2>6. Les 5 erreurs qui plombent un prompt</h2>
        <ul>
          <li><strong>Le flou</strong> (« aide-moi avec mon marketing ») : aucune cible.</li>
          <li><strong>Pas de format imposé</strong> : la réponse part dans tous les sens.</li>
          <li><strong>Aucun exemple</strong> : style fade et « reconnaissable IA ».</li>
          <li><strong>La surcharge</strong> : trois tâches dans un seul prompt.</li>
          <li><strong>Les contraintes implicites</strong> : vous attendiez 100 mots, vous en recevez 600. Dites-le.</li>
        </ul>

        <div className="article-callout">
          <div className="article-callout-ico">⚡</div>
          <div>
            <strong>Le réflexe gagnant</strong>
            Le prompt parfait du premier coup n'existe pas. Lancez une v1 structurée, regardez ce qui
            cloche, ajustez <em>un</em> bloc à la fois. Trois itérations suffisent presque toujours.
          </div>
        </div>

        <h2>En résumé</h2>
        <p>
          Un prompt efficace tient en six blocs : <strong>rôle, contexte, tâche, format, contraintes,
          exemples</strong>. Ajoutez des <strong>exemples</strong> pour cadrer le style, le <strong>raisonnement
          pas à pas</strong> pour la logique, et <strong>décomposez</strong> les tâches complexes. Variabilisez
          ce qui marche, adaptez au modèle, et itérez. Vous passerez de « réponses correctes » à « réponses
          directement exploitables » — c'est exactement la différence entre un ChatGPT générique et un agent
          bien conçu.
        </p>
      </div>

      <div className="article-cta">
        <h3>Pas envie de fabriquer vos prompts à la main ?</h3>
        <p>
          Nos agents prêts à l'emploi embarquent déjà ces méthodes — y compris un générateur de prompts.
          À débloquer pour 4,90 € dans la marketplace.
        </p>
        <Link href="/agents-gpt" className="btn btn-primary btn-xl">Voir les agents prêts à l'emploi →</Link>
      </div>
    </div>
  );
}
