import type { Metadata } from "next";
import Link from "next/link";
import { Link2, LineChart, BadgeCheck, Wallet, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Programme partenaire — MonAgentPerso",
  description:
    "Recommandez MonAgentPerso et touchez une commission sur chaque vente confirmée. Lien unique, suivi automatique, paiements réguliers.",
};

const points = [
  { Icon: Link2, title: "Un lien unique", text: "Chaque partenaire reçoit un lien personnalisé à partager où il le souhaite." },
  { Icon: LineChart, title: "Suivi automatique", text: "Les ventes générées via votre lien sont suivies automatiquement, sans rien à installer." },
  { Icon: BadgeCheck, title: "Commission claire", text: "Votre commission est calculée automatiquement après chaque paiement confirmé." },
  { Icon: Wallet, title: "Paiements réguliers", text: "Les commissions sont réglées manuellement, à une fréquence définie ensemble." },
  { Icon: ShieldCheck, title: "Des règles justes", text: "Les commissions ne s'appliquent pas aux paiements remboursés ou contestés." },
  { Icon: Mail, title: "Récapitulatif", text: "Un récapitulatif de vos ventes et commissions peut vous être envoyé." },
];

export default function ProgrammePartenairePage() {
  return (
    <div className="container" style={{ padding: "72px 0 90px", maxWidth: 880 }}>
      <span className="section-eyebrow">Programme partenaire</span>
      <h1 style={{ margin: "16px 0 0" }}>Recommandez MonAgentPerso, soyez récompensé.</h1>
      <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.6, marginTop: 18 }}>
        Vous aimez l'idée d'un agent IA métier livré clé en main ? Parlez-en à votre communauté.
        Pour chaque personne qui commande grâce à vous, vous touchez une commission. C'est simple,
        transparent, et pensé pour les créateurs.
      </p>

      <div className="card-grid" style={{ marginTop: 40, gridTemplateColumns: "repeat(3,1fr)" }}>
        {points.map(({ Icon, title, text }) => (
          <article className="benefit-card" key={title}>
            <div className="big-picto"><Icon size={26} strokeWidth={1.9} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: "24px 28px",
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>Comment ça marche</h2>
        <ol style={{ color: "var(--ink-2)", lineHeight: 1.8, marginTop: 12, paddingLeft: 20 }}>
          <li>Nous créons votre lien partenaire unique.</li>
          <li>Vous le partagez auprès de votre audience.</li>
          <li>Les ventes confirmées via votre lien sont suivies automatiquement.</li>
          <li>Votre commission est calculée après chaque paiement validé.</li>
          <li>Nous vous réglons vos commissions à la fréquence convenue.</li>
        </ol>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 14, lineHeight: 1.6 }}>
          Pas de promesse irréaliste : une recommandation sincère, une rémunération honnête. Les
          commissions concernent uniquement les paiements confirmés et non remboursés.
        </p>
        <Link
          href="/"
          className="btn btn-primary btn-xl"
          style={{ marginTop: 22 }}
        >
          Devenir partenaire →
        </Link>
        <p style={{ color: "var(--muted-2)", fontSize: 13, marginTop: 10 }}>
          Intéressé·e ? Contactez-nous pour recevoir votre lien et les modalités.
        </p>
      </div>
    </div>
  );
}
