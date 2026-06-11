import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, dictFor } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  if (locale === "en") {
    return {
      title: "Why your CV never reaches the recruiter (and how to pass ATS) — MonAgentPerso",
      description:
        "8 out of 10 CVs are filtered by software before any human look. How ATS work, the formatting that passes, the keywords that count and the bullets that land an interview.",
    };
  }
  return {
    title: "Pourquoi votre CV n'arrive jamais au recruteur (et comment passer les ATS) — MonAgentPerso",
    description:
      "8 CV sur 10 sont filtrés par un logiciel avant tout regard humain. Comment fonctionnent les ATS, le formatage qui passe, les mots-clés qui comptent et les puces qui décrochent un entretien.",
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
          <span className="section-eyebrow">Jobs</span>
          <span>· 7 min read</span>
        </div>
        <h1>Why your CV never reaches the recruiter</h1>
        <p className="article-lead">
          You apply, you get nothing back, not even a rejection. The problem often isn't your profile: it's that
          a <strong>piece of software</strong> filtered out your CV before a human opened it. Most companies now
          screen via an ATS. Here's how it reads your CV — and what to change to clear the filter.
        </p>

        <div className="article-content">
          <p>
            An ATS (<em>Applicant Tracking System</em>) is the software that receives and ranks applications.
            According to industry data, nearly <strong>99% of recruiters</strong> apply keyword filters to it.
            Understanding its logic means you stop playing against it.
          </p>

          <h2>1. How an ATS (really) reads your CV</h2>
          <p>The journey is always the same:</p>
          <ol>
            <li><strong>Parsing</strong>: the software extracts the text and tries to sort it into fields (name, contact, experience, education, skills).</li>
            <li><strong>Normalization</strong>: it converts everything to standard text to compare candidates with each other.</li>
            <li><strong>Matching</strong>: it compares your CV to the job (skills, tools, title) and computes a <strong>match score</strong>.</li>
            <li><strong>Ranking</strong>: a poorly read CV or one missing the right keywords falls to the bottom of the pile, or is filtered out.</li>
          </ol>
          <div className="article-callout">
            <div className="article-callout-ico">⚠</div>
            <div>
              <strong>Pitfall #1</strong>
              Contact details placed in the <strong>header or footer</strong> are missed by the ATS about one
              time in four. Always put email and phone in the body of the document.
            </div>
          </div>

          <h2>2. The formatting that passes — and the one that breaks everything</h2>
          <div className="article-two-col">
            <div>
              <h3>Do</h3>
              <ul>
                <li><strong>Single-column</strong> layout.</li>
                <li><strong>Standard</strong> section titles (Experience, Education, Skills).</li>
                <li>Classic font (Arial, Calibri, Times).</li>
                <li><strong>Selectable</strong> text (never an image).</li>
                <li>Export to <strong>PDF</strong> (or .docx if the job requires it).</li>
              </ul>
            </div>
            <div>
              <h3>Avoid</h3>
              <ul>
                <li>Multiple columns, <strong>tables</strong>, text boxes.</li>
                <li>Images, logos, <strong>skill gauges</strong>.</li>
                <li>Icons, exotic characters.</li>
                <li>Key info in the header/footer.</li>
                <li>“Creative” templates packed with columns.</li>
              </ul>
            </div>
          </div>
          <p>
            The “designed” CV you find pretty is often unreadable to the machine. Keep an{" "}
            <strong>ATS (plain text)</strong> version for applying online; save the design for sending directly
            to a human.
          </p>

          <h2>3. Keywords: reuse the exact terms from the job</h2>
          <p>
            This is the highest-return factor. Across large volumes of applications, those who{" "}
            <strong>tailor their CV to the job get about twice as many interviews</strong>. The rule:
          </p>
          <ul>
            <li>Spot the <strong>literal</strong> skills, tools and titles in the ad.</li>
            <li>Reuse them <strong>as is</strong>: if the job says “project management”, write “project management”, not “I led projects”. The ATS doesn't guess synonyms.</li>
            <li>But <strong>anchor every keyword in something real</strong>: a term you couldn't defend in an interview has no place on the CV.</li>
          </ul>
          <p>
            To avoid: <em>keyword stuffing</em> (piling up keywords out of context). It reads copy-pasted and gets
            spotted immediately.
          </p>

          <h2>4. Bullets that land the interview</h2>
          <p>
            The human recruiter decides in <strong>under 8 seconds</strong>. What grabs them: results, not tasks.
            Turn each line into the <strong>PAR</strong> format (Problem → Action → Result), with a figure.
          </p>
          <p><strong>Before:</strong> “Sales manager, managing a client portfolio.”</p>
          <p><strong>After:</strong> “Grew a portfolio of 42 B2B accounts and lifted revenue from €847k to €1.21M in 14 months.”</p>
          <div className="article-callout">
            <div className="article-callout-ico">✦</div>
            <div>
              <strong>The “asymmetric numbers” trick</strong>
              Numbers that are too round (“+20%, 1000 clients”) sound made up. Precise, irregular numbers
              (“+37%, 1,248 clients, 14 months”) signal a real measurement — and inspire more trust.
            </div>
          </div>

          <h2>5. The new pitfall: “it smells of AI”</h2>
          <p>
            More and more recruiters (and recent ATS) spot CVs generated without proofreading. The signals: a
            robotic vocabulary and interchangeable phrasing. To avoid:
          </p>
          <ul>
            <li>“AI-signature” verbs (<em>spearheaded, orchestrated, leveraged</em>) and the empty shells: “equipped with proven expertise”, “passionate about challenges”, “solution-oriented”.</li>
            <li>Bullets all identical in length and structure.</li>
            <li>The total absence of concrete details (project names, context, precise figures).</li>
          </ul>
          <p>
            The right reflex: AI saves time on the skeleton, but it's <strong>you</strong> who inject the true
            details no machine can invent.
          </p>

          <h2>6. France vs international: don't get it wrong</h2>
          <ul>
            <li><strong>Photo</strong>: tolerated in France, <strong>to be banned</strong> for US/UK/Canada applications (anti-discrimination).</li>
            <li><strong>Age, nationality, family status</strong>: optional in France, <strong>forbidden</strong> in English-speaking countries.</li>
            <li>Adapt to the <strong>employer's country</strong>, not yours.</li>
          </ul>

          <h2>The checklist before sending</h2>
          <ul>
            <li>Title and headline aligned with the job?</li>
            <li>Exact keywords from the job, anchored in something real?</li>
            <li>Each experience = PAR format with a quantified result?</li>
            <li>Single-column format, no table or image, contact in the body?</li>
            <li>Zero typos, zero hollow buzzwords, bullets of varied lengths?</li>
            <li>Fits on one page (two for a senior profile)?</li>
          </ul>

          <h2>In short</h2>
          <p>
            Your CV must please <strong>two readers</strong>: a piece of software and a human. For the software:
            clean formatting and the job's exact keywords. For the human: quantified, precise results, and text
            that doesn't smell of copy-paste. The same profile, presented by these rules, goes from “never a reply”
            to “several interviews” — without exaggerating anything.
          </p>
        </div>

        <div className="article-cta">
          <h3>A CV tailored to the job, in minutes</h3>
          <p>
            Our CV agent optimizes your CV for ATS, reuses the ad's keywords and quantifies your results — without
            inventing anything. Unlock it for €4.90.
          </p>
          <Link href="/agents-gpt" className="btn btn-primary btn-xl">See the CV agent →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container article">
      <Link href="/blog" className="article-back">{b.backAll}</Link>
      <div className="article-meta">
        <span className="section-eyebrow">Emploi</span>
        <span>· 7 min de lecture</span>
      </div>
      <h1>Pourquoi votre CV n'arrive jamais au recruteur</h1>
      <p className="article-lead">
        Vous postulez, vous ne recevez rien, pas même un refus. Le problème n'est souvent pas votre
        profil : c'est qu'un <strong>logiciel</strong> a écarté votre CV avant qu'un humain ne l'ouvre.
        La majorité des entreprises trient désormais via un ATS. Voici comment il lit votre CV — et ce
        qu'il faut changer pour franchir le filtre.
      </p>

      <div className="article-content">
        <p>
          Un ATS (<em>Applicant Tracking System</em>) est le logiciel qui réceptionne et classe les
          candidatures. D'après les données du secteur, près de <strong>99 % des recruteurs</strong> y
          appliquent des filtres par mots-clés. Comprendre sa logique, c'est arrêter de jouer contre lui.
        </p>

        <h2>1. Comment un ATS lit (vraiment) votre CV</h2>
        <p>Le parcours est toujours le même :</p>
        <ol>
          <li><strong>Parsing</strong> : le logiciel extrait le texte et tente de le ranger dans des champs (nom, contact, expériences, formation, compétences).</li>
          <li><strong>Normalisation</strong> : il convertit tout en texte standard pour comparer les candidats entre eux.</li>
          <li><strong>Matching</strong> : il compare votre CV à l'offre (compétences, outils, intitulé) et calcule un <strong>score de correspondance</strong>.</li>
          <li><strong>Classement</strong> : un CV mal lu ou sans les bons mots-clés tombe en bas de pile, voire est écarté.</li>
        </ol>
        <div className="article-callout">
          <div className="article-callout-ico">⚠</div>
          <div>
            <strong>Le piège n°1</strong>
            Les coordonnées placées dans l'<strong>en-tête ou le pied de page</strong> sont ratées par
            l'ATS environ une fois sur quatre. Mettez toujours email et téléphone dans le corps du document.
          </div>
        </div>

        <h2>2. Le formatage qui passe — et celui qui casse tout</h2>
        <div className="article-two-col">
          <div>
            <h3>À faire</h3>
            <ul>
              <li>Mise en page <strong>mono-colonne</strong>.</li>
              <li>Titres de sections <strong>standard</strong> (Expériences, Formation, Compétences).</li>
              <li>Police classique (Arial, Calibri, Times).</li>
              <li>Texte <strong>sélectionnable</strong> (jamais une image).</li>
              <li>Export <strong>PDF</strong> (ou .docx si l'offre l'exige).</li>
            </ul>
          </div>
          <div>
            <h3>À éviter</h3>
            <ul>
              <li>Colonnes multiples, <strong>tableaux</strong>, zones de texte.</li>
              <li>Images, logos, <strong>jauges de compétences</strong>.</li>
              <li>Icônes, caractères exotiques.</li>
              <li>Infos clés en en-tête/pied de page.</li>
              <li>Modèles « créatifs » bourrés de colonnes.</li>
            </ul>
          </div>
        </div>
        <p>
          Le CV « designé » que vous trouvez beau est souvent illisible pour la machine. Gardez une
          version <strong>ATS (texte pur)</strong> pour postuler en ligne ; réservez le design à l'envoi
          direct à un humain.
        </p>

        <h2>3. Les mots-clés : reprenez les termes exacts de l'offre</h2>
        <p>
          C'est le facteur le plus rentable. Sur de larges volumes de candidatures, ceux qui{" "}
          <strong>adaptent leur CV à l'offre obtiennent environ deux fois plus d'entretiens</strong>. La
          règle :
        </p>
        <ul>
          <li>Repérez les compétences, outils et intitulés <strong>littéraux</strong> de l'annonce.</li>
          <li>Réutilisez-les <strong>tels quels</strong> : si l'offre dit « gestion de projet », écrivez « gestion de projet », pas « j'ai piloté des projets ». L'ATS ne devine pas les synonymes.</li>
          <li>Mais <strong>ancrez chaque mot-clé dans du réel</strong> : un terme que vous ne pourriez pas défendre en entretien n'a rien à faire sur le CV.</li>
        </ul>
        <p>
          À fuir : le <em>keyword stuffing</em> (entasser des mots-clés hors contexte). Ça sonne
          copié-collé et se repère immédiatement.
        </p>

        <h2>4. Des puces qui décrochent l'entretien</h2>
        <p>
          Le recruteur humain, lui, décide en <strong>moins de 8 secondes</strong>. Ce qui accroche : des
          résultats, pas des tâches. Transformez chaque ligne au format <strong>PAR</strong> (Problème →
          Action → Résultat), avec un chiffre.
        </p>
        <p><strong>Avant :</strong> « Responsable des ventes, gestion d'un portefeuille clients. »</p>
        <p><strong>Après :</strong> « Développé un portefeuille de 42 comptes B2B et porté le CA de 847 k€ à 1,21 M€ en 14 mois. »</p>
        <div className="article-callout">
          <div className="article-callout-ico">✦</div>
          <div>
            <strong>L'astuce des chiffres « asymétriques »</strong>
            Les chiffres trop ronds (« +20 %, 1000 clients ») sonnent inventés. Des nombres précis et
            irréguliers (« +37 %, 1 248 clients, 14 mois ») signalent une mesure réelle — et inspirent
            davantage confiance.
          </div>
        </div>

        <h2>5. Le nouveau piège : « ça sent l'IA »</h2>
        <p>
          De plus en plus de recruteurs (et d'ATS récents) repèrent les CV générés sans relecture. Les
          signaux : un vocabulaire de robot et des formulations interchangeables. À éviter :
        </p>
        <ul>
          <li>Les verbes « signature IA » en anglais (<em>spearheaded, orchestrated, leveraged</em>) et, en français, les coquilles vides : « doté d'une expertise avérée », « passionné par les défis », « force de proposition ».</li>
          <li>Des puces toutes identiques en longueur et en structure.</li>
          <li>L'absence totale de détails concrets (noms de projets, contexte, chiffres précis).</li>
        </ul>
        <p>
          Le bon réflexe : l'IA fait gagner du temps sur le squelette, mais c'est <strong>vous</strong>
          qui injectez les détails vrais qu'aucune machine ne peut inventer.
        </p>

        <h2>6. France vs international : ne vous trompez pas</h2>
        <ul>
          <li><strong>Photo</strong> : tolérée en France, <strong>à proscrire</strong> pour les candidatures US/UK/Canada (anti-discrimination).</li>
          <li><strong>Âge, nationalité, situation familiale</strong> : facultatifs en France, <strong>interdits</strong> dans les pays anglo-saxons.</li>
          <li>Adaptez selon le <strong>pays de l'employeur</strong>, pas le vôtre.</li>
        </ul>

        <h2>La checklist avant d'envoyer</h2>
        <ul>
          <li>Intitulé et accroche alignés sur l'offre ?</li>
          <li>Mots-clés exacts de l'offre, ancrés dans du réel ?</li>
          <li>Chaque expérience = format PAR avec un résultat chiffré ?</li>
          <li>Format mono-colonne, sans tableau ni image, coordonnées dans le corps ?</li>
          <li>Zéro faute, zéro buzzword creux, puces de longueurs variées ?</li>
          <li>Tient en une page (deux si profil senior) ?</li>
        </ul>

        <h2>En résumé</h2>
        <p>
          Votre CV doit plaire à <strong>deux lecteurs</strong> : un logiciel et un humain. Au logiciel :
          un formatage propre et les mots-clés exacts de l'offre. À l'humain : des résultats chiffrés,
          précis, et un texte qui ne sent pas le copier-coller. Un même profil, présenté selon ces
          règles, passe de « jamais de réponse » à « plusieurs entretiens » — sans rien exagérer.
        </p>
      </div>

      <div className="article-cta">
        <h3>Un CV taillé pour l'offre, en quelques minutes</h3>
        <p>
          Notre agent CV optimise votre CV pour les ATS, reprend les mots-clés de l'annonce et chiffre
          vos résultats — sans rien inventer. À débloquer pour 4,90 €.
        </p>
        <Link href="/agents-gpt" className="btn btn-primary btn-xl">Voir l'agent CV →</Link>
      </div>
    </div>
  );
}
