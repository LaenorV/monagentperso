import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  throw new Error("STRIPE_SECRET_KEY est manquante dans .env.local");
}

// Pas d'apiVersion forcée — le SDK utilise sa version native (recommandé).
export const stripe = new Stripe(apiKey);
