"use client";

import Link from "next/link";

export default function PaymentPage() {
  return (
    <div className="container payment-page">
      <div className="payment-box">
        <span className="section-eyebrow">Paiement sécurisé</span>
        <h1>Finalisez votre commande</h1>
        <p style={{ fontSize: 20, color: "#625c54", lineHeight: 1.65 }}>
          Votre agent sera livré sous 24h maximum au mail renseigné. Pour contacter le support : <b>*****</b>
        </p>
        <div className="old-price" style={{ textAlign: "center" }}>79,90€</div>
        <p className="price" style={{ color: "#111", fontSize: 70 }}>49,90€</p>
        <button className="btn btn-dark" style={{ width: "100%", marginTop: 10 }}>Payer 49,90€</button>
        <Link className="btn btn-light" style={{ width: "100%", marginTop: 12 }} href="/">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
