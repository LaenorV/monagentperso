import Link from "next/link";
import {
  Mail,
  FileText,
  Workflow,
  Sparkles,
  Timer,
  FileCheck2,
  Layers,
  Award,
  ClipboardList,
  Inbox,
  CreditCard,
  Send,
  Rocket,
  Check,
  Zap,
  Store,
  ArrowRight,
} from "lucide-react";
import CtaButton from "@/components/CtaButton";
import ComparisonVideos from "@/components/ComparisonVideos";
import AuthReassure from "@/components/AuthReassure";

export default function HomePage() {
  return (
    <>
      {/* === HERO === */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <div className="pill">
              <span className="pill-dot" />
              Agent professionnel personnalisé · livré sous 24h
            </div>
            <h1>Votre agent IA métier, prêt à travailler comme vous.</h1>
            <h2>
              Vous décrivez votre besoin, vos règles et vos documents en quelques minutes. Nous concevons un assistant
              opérationnel, simple à utiliser, adapté à votre métier et à votre manière de travailler.
            </h2>
            <div className="cta-row">
              <CtaButton className="btn btn-primary btn-xl">Réclamer mon agent IA →</CtaButton>
              <Link className="btn btn-light btn-xl" href="#exemples">Voir des exemples</Link>
            </div>
            <div className="trust-row">
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> 24h maximum</div>
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> 3 min de questionnaire</div>
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> 49,90€ lancement</div>
            </div>
            <AuthReassure />
          </div>
          <div className="hero-panel">
            <div className="hero-panel-inner">
              <div className="panel-content">
                <div className="mini-agent">
                  <div className="agent-logo">M</div>
                  <div>
                    <strong>Agent métier personnalisé</strong>
                    <small>ChatGPT · Claude · Gemini</small>
                  </div>
                </div>
                <div className="dash-list">
                  <div className="dash-item">
                    <span className="dash-ico"><Mail size={22} strokeWidth={2} /></span>
                    <div>
                      <b>Emails, réponses, contenus</b>
                      <span>Votre style, vos règles, vos exemples</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><FileText size={22} strokeWidth={2} /></span>
                    <div>
                      <b>Devis, rapports, livrables</b>
                      <span>Formaté selon votre métier</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><Workflow size={22} strokeWidth={2} /></span>
                    <div>
                      <b>Workflow opérationnel</b>
                      <span>Un agent utilisable immédiatement</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><Sparkles size={22} strokeWidth={2} /></span>
                    <div>
                      <b>Sans formation technique</b>
                      <span>L'outil que vous connaissez déjà</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === BENEFIT CARDS === */}
      <div className="container">
        <div className="card-grid">
          <article className="benefit-card">
            <div className="big-picto"><Timer size={28} strokeWidth={1.8} /></div>
            <h3>Temps récupéré</h3>
            <p>Moins de tâches répétitives, plus d'actions à forte valeur ajoutée.</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><FileCheck2 size={28} strokeWidth={1.8} /></div>
            <h3>Livrables prêts</h3>
            <p>Emails, rapports, contenus, devis : structurés à votre format.</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><Layers size={28} strokeWidth={1.8} /></div>
            <h3>Sur vos outils</h3>
            <p>Agent GPT, Claude.md ou Gemini Gem, selon votre préférence.</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><Award size={28} strokeWidth={1.8} /></div>
            <h3>Aucune formation</h3>
            <p>Simple à utiliser, même sans aucune maîtrise technique.</p>
          </article>
        </div>
      </div>

      {/* === MARKETPLACE === */}
      <div className="container">
        <div className="home-mk">
          <div className="home-mk-text">
            <span className="section-eyebrow">Nouveau · Marketplace</span>
            <h2 className="home-mk-title">Une marketplace IA, des milliers de ressources.</h2>
            <p className="home-mk-sub">
              Au-delà de votre agent sur-mesure, explorez notre marketplace : des milliers
              d'outils IA, des prompts prêts à l'emploi, des agents GPT et Claude sur-entraînés
              et des workflows automatisés en JSON. Tout pour aller plus vite, au même endroit.
            </p>
            <ul className="home-mk-list">
              <li><Check size={18} strokeWidth={2.5} /> Outils IA classés par métier et par usage</li>
              <li><Check size={18} strokeWidth={2.5} /> Prompts, agents & workflows prêts à l'emploi</li>
              <li><Check size={18} strokeWidth={2.5} /> Recherche et filtres pour trouver en quelques secondes</li>
            </ul>
            <Link href="/marketplace" className="btn btn-primary btn-xl">
              Découvrir la marketplace <ArrowRight size={18} strokeWidth={2.2} />
            </Link>
          </div>
          <div className="home-mk-visual" aria-hidden="true">
            <div className="home-mk-picto">
              <Store size={150} strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </div>

      {/* === PROCESS — cards === */}
      <div className="process">
        <div className="container process-box">
          <span className="section-eyebrow">Comment ça se passe</span>
          <h2 className="section-title">Un process simple, sans rendez-vous inutile.</h2>
          <p className="section-sub">
            De votre questionnaire à la prise en main de votre agent, tout est cadré et fluide.
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <span className="step-ico"><ClipboardList size={22} strokeWidth={2} /></span>
              <h4>Questionnaire en 3 minutes</h4>
              <p>Vous répondez aux questions guidées sur votre métier.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <span className="step-ico"><Inbox size={22} strokeWidth={2} /></span>
              <h4>Réception de vos informations</h4>
              <p>Nous analysons vos réponses, documents et coordonnées.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <span className="step-ico"><CreditCard size={22} strokeWidth={2} /></span>
              <h4>Paiement sécurisé</h4>
              <p>Vous validez votre commande en quelques clics.</p>
            </div>
            <div className="step-card">
              <div className="step-num">4</div>
              <span className="step-ico"><Send size={22} strokeWidth={2} /></span>
              <h4>Livraison sous 24h</h4>
              <p>Vous recevez votre agent personnalisé par email.</p>
            </div>
            <div className="step-card">
              <div className="step-num">5</div>
              <span className="step-ico"><Rocket size={22} strokeWidth={2} /></span>
              <h4>Utilisation immédiate</h4>
              <p>Sur ChatGPT, Claude ou Gemini, prêt à travailler.</p>
            </div>
          </div>
        </div>
      </div>

      {/* === EXAMPLES === */}
      <div id="exemples" className="examples">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">Exemples concrets</span>
            <h2 className="section-title">Comparez par vous-même.</h2>
            <p className="section-sub">Même demande, deux outils. La différence se voit à l'écran, en moins d'une minute.</p>
          </div>
          <ComparisonVideos />
          <div className="examples-cta">
            <CtaButton className="btn btn-primary btn-xl">
              Réclamer mon Agent IA personnalisé →
            </CtaButton>
          </div>
        </div>
      </div>

      {/* === REVIEWS === */}
      <div className="reviews-section">
        <div className="container">
          <div className="reviews-head">
            <span className="section-eyebrow">Vos retours</span>
            <h2 className="section-title">Ce qu'en disent les professionnels.</h2>
          </div>
          <div className="reviews-grid">
            <article className="review">
              <div>
                <div className="stars">★★★★★</div>
                <p>“Je m'attendais à un truc très compliqué, mais au final l'agent est simple à utiliser. J'ai surtout gagné du temps sur mes réponses clients et mes mails un peu pénibles.”</p>
              </div>
              <div className="person">
                <div className="avatar">M</div>
                <div>
                  <b>Marc D.</b>
                  <span>Consultant indépendant</span>
                </div>
              </div>
            </article>
            <article className="review">
              <div>
                <div className="stars">★★★★★</div>
                <p>“Le questionnaire force à bien expliquer son besoin, c'est un peu long sur le moment mais le résultat est beaucoup plus précis. Très bonne surprise.”</p>
              </div>
              <div className="person">
                <div className="avatar">S</div>
                <div>
                  <b>Sarah L.</b>
                  <span>Responsable marketing</span>
                </div>
              </div>
            </article>
            <article className="review">
              <div>
                <div className="stars">★★★★☆</div>
                <p>“J'aurais aimé avoir 2 ou 3 exemples de plus dans la première version, mais l'agent est vraiment utile après prise en main. On sent que c'est personnalisé.”</p>
              </div>
              <div className="person">
                <div className="avatar">T</div>
                <div>
                  <b>Thomas R.</b>
                  <span>Fondateur d'agence</span>
                </div>
              </div>
            </article>
            <article className="review">
              <div>
                <div className="stars">★★★★★</div>
                <p>“Très clair, pas de blabla. Je l'utilise pour préparer mes posts, mes réponses et des petits documents internes. Ça garde bien mon style.”</p>
              </div>
              <div className="person">
                <div className="avatar">C</div>
                <div>
                  <b>Camille B.</b>
                  <span>Chargée de communication</span>
                </div>
              </div>
            </article>
            <article className="review">
              <div>
                <div className="stars">★★★★☆</div>
                <p>“Le rendu dépend beaucoup des documents envoyés, donc il faut jouer le jeu. Mais une fois les infos données, c'est confortable et rapide à utiliser.”</p>
              </div>
              <div className="person">
                <div className="avatar">N</div>
                <div>
                  <b>Nadia P.</b>
                  <span>Office manager</span>
                </div>
              </div>
            </article>
            <article className="review">
              <div>
                <div className="stars">★★★★★</div>
                <p>“Je l'utilise pour structurer mes relances. Ça ne vend pas à ma place, mais ça m'évite de repartir d'une page blanche à chaque fois.”</p>
              </div>
              <div className="person">
                <div className="avatar">J</div>
                <div>
                  <b>Julien M.</b>
                  <span>Business developer</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* === PRICING / FLASH SALE === */}
      <div className="pricing-section">
        <div className="container">
          <div className="flash-banner">
            <Zap size={16} className="flash-ico" />
            Jusqu'au 21 juin, bénéficiez d'une offre unique de lancement
            <Zap size={16} className="flash-ico" />
          </div>
          <div className="pricing-grid">
            <div>
              <span className="pricing-eyebrow">Offre de lancement</span>
              <h2 className="pricing-title">Un agent personnalisé à prix fixe.</h2>
              <span className="pricing-deadline">Réduction valable jusqu'au 21 juin</span>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 17, marginTop: 18 }}>
                3 minutes de questionnaire, 24h d'attente maximum, une expertise en création d'agents,
                et une personnalisation poussée autour de votre métier, de vos documents et de votre
                manière de communiquer.
              </p>
            </div>
            <div className="price-card">
              <div className="price-content">
                <span className="launch">Réduction temporaire</span>
                <div className="old-price">79,90€</div>
                <p className="price">49,90€ <small>TTC</small></p>
                <div className="price-list">
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> Questionnaire guidé en quelques minutes</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> Livraison sous 24h maximum</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> Agent personnalisé selon votre métier</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> ChatGPT, Claude ou Gemini</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> Aucune formation technique nécessaire</div>
                </div>
                <CtaButton className="btn btn-beige btn-xl" style={{ width: "100%", marginTop: 22 }}>
                  Réclamer mon agent IA →
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
