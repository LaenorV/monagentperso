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
import LandingWheelAuto from "@/components/wheel/LandingWheelAuto";
import { getDict } from "@/lib/i18n/server";

export default async function HomePage() {
  const t = await getDict();
  const h = t.home;
  return (
    <>
      <LandingWheelAuto />
      {/* === HERO === */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <div className="pill">
              <span className="pill-dot" />
              {h.pill}
            </div>
            <h1>{h.h1}</h1>
            <h2>{h.h2}</h2>
            <div className="cta-row">
              <CtaButton className="btn btn-primary btn-xl">{h.ctaClaim}</CtaButton>
              <Link className="btn btn-light btn-xl" href="#exemples">{h.seeExamples}</Link>
            </div>
            <div className="trust-row">
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> {h.trust1}</div>
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> {h.trust2}</div>
              <div className="trust"><span className="trust-ico"><Check size={18} strokeWidth={2.5} /></span> {h.trust3}</div>
            </div>
            <AuthReassure />
          </div>
          <div className="hero-panel">
            <div className="hero-panel-inner">
              <div className="panel-content">
                <div className="mini-agent">
                  <div className="agent-logo">M</div>
                  <div>
                    <strong>{h.panelTitle}</strong>
                    <small>{h.panelSub}</small>
                  </div>
                </div>
                <div className="dash-list">
                  <div className="dash-item">
                    <span className="dash-ico"><Mail size={22} strokeWidth={2} /></span>
                    <div>
                      <b>{h.panelItem1Title}</b>
                      <span>{h.panelItem1Sub}</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><FileText size={22} strokeWidth={2} /></span>
                    <div>
                      <b>{h.panelItem2Title}</b>
                      <span>{h.panelItem2Sub}</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><Workflow size={22} strokeWidth={2} /></span>
                    <div>
                      <b>{h.panelItem3Title}</b>
                      <span>{h.panelItem3Sub}</span>
                    </div>
                  </div>
                  <div className="dash-item">
                    <span className="dash-ico"><Sparkles size={22} strokeWidth={2} /></span>
                    <div>
                      <b>{h.panelItem4Title}</b>
                      <span>{h.panelItem4Sub}</span>
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
            <h3>{h.benefit1Title}</h3>
            <p>{h.benefit1}</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><FileCheck2 size={28} strokeWidth={1.8} /></div>
            <h3>{h.benefit2Title}</h3>
            <p>{h.benefit2}</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><Layers size={28} strokeWidth={1.8} /></div>
            <h3>{h.benefit3Title}</h3>
            <p>{h.benefit3}</p>
          </article>
          <article className="benefit-card">
            <div className="big-picto"><Award size={28} strokeWidth={1.8} /></div>
            <h3>{h.benefit4Title}</h3>
            <p>{h.benefit4}</p>
          </article>
        </div>
      </div>

      {/* === MARKETPLACE === */}
      <div className="container">
        <div className="home-mk">
          <div className="home-mk-text">
            <span className="section-eyebrow">{h.mkEyebrow}</span>
            <h2 className="home-mk-title">{h.mkTitle}</h2>
            <p className="home-mk-sub">{h.mkSub}</p>
            <ul className="home-mk-list">
              <li><Check size={18} strokeWidth={2.5} /> {h.mkList1}</li>
              <li><Check size={18} strokeWidth={2.5} /> {h.mkList2}</li>
              <li><Check size={18} strokeWidth={2.5} /> {h.mkList3}</li>
            </ul>
            <Link href="/marketplace" className="btn btn-primary btn-xl">
              {h.mkCta} <ArrowRight size={18} strokeWidth={2.2} />
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
          <span className="section-eyebrow">{h.processEyebrow}</span>
          <h2 className="section-title">{h.processTitle}</h2>
          <p className="section-sub">{h.processSub}</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <span className="step-ico"><ClipboardList size={22} strokeWidth={2} /></span>
              <h4>{h.step1Title}</h4>
              <p>{h.step1}</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <span className="step-ico"><Inbox size={22} strokeWidth={2} /></span>
              <h4>{h.step2Title}</h4>
              <p>{h.step2}</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <span className="step-ico"><CreditCard size={22} strokeWidth={2} /></span>
              <h4>{h.step3Title}</h4>
              <p>{h.step3}</p>
            </div>
            <div className="step-card">
              <div className="step-num">4</div>
              <span className="step-ico"><Send size={22} strokeWidth={2} /></span>
              <h4>{h.step4Title}</h4>
              <p>{h.step4}</p>
            </div>
            <div className="step-card">
              <div className="step-num">5</div>
              <span className="step-ico"><Rocket size={22} strokeWidth={2} /></span>
              <h4>{h.step5Title}</h4>
              <p>{h.step5}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === EXAMPLES === */}
      <div id="exemples" className="examples">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{h.examplesEyebrow}</span>
            <h2 className="section-title">{h.examplesTitle}</h2>
            <p className="section-sub">{h.examplesSub}</p>
          </div>
          <ComparisonVideos />
          <div className="examples-cta">
            <CtaButton className="btn btn-primary btn-xl">{h.examplesCta}</CtaButton>
          </div>
        </div>
      </div>

      {/* === REVIEWS === */}
      <div className="reviews-section">
        <div className="container">
          <div className="reviews-head">
            <span className="section-eyebrow">{h.reviewsEyebrow}</span>
            <h2 className="section-title">{h.reviewsTitle}</h2>
          </div>
          <div className="reviews-grid">
            {h.reviews.map((r, i) => (
              <article className="review" key={i}>
                <div>
                  <div className="stars">{r.stars}</div>
                  <p>“{r.text}”</p>
                </div>
                <div className="person">
                  <div className="avatar">{r.name.charAt(0)}</div>
                  <div>
                    <b>{r.name}</b>
                    <span>{r.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* === PRICING / FLASH SALE === */}
      <div className="pricing-section">
        <div className="container">
          <div className="flash-banner">
            <Zap size={16} className="flash-ico" />
            {h.flashBanner}
            <Zap size={16} className="flash-ico" />
          </div>
          <div className="pricing-grid">
            <div>
              <span className="pricing-eyebrow">{h.pricingEyebrow}</span>
              <h2 className="pricing-title">{h.pricingTitle}</h2>
              <span className="pricing-deadline">{h.pricingDeadline}</span>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 17, marginTop: 18 }}>
                {h.pricingDesc}
              </p>
            </div>
            <div className="price-card">
              <div className="price-content">
                <span className="launch">{h.priceLaunch}</span>
                <div className="old-price">79,90€</div>
                <p className="price">49,90€ <small>TTC</small></p>
                <div className="price-list">
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> {h.priceFeat1}</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> {h.priceFeat2}</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> {h.priceFeat3}</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> {h.priceFeat4}</div>
                  <div className="price-line"><span className="price-line-ico"><Check size={18} strokeWidth={2.5} /></span> {h.priceFeat5}</div>
                </div>
                <CtaButton className="btn btn-beige btn-xl" style={{ width: "100%", marginTop: 22 }}>
                  {h.priceCta}
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
