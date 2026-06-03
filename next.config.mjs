/** @type {import('next').NextConfig} */
const nextConfig = {
  // Embarque le contenu des agents (instructions + PDF) dans les fonctions
  // serverless qui le lisent, afin qu'il soit disponible en production (Vercel).
  // Ces fichiers ne sont JAMAIS dans /public → non accessibles sans achat.
  outputFileTracingIncludes: {
    "/api/agents/**": ["./content/agents/**/*"],
    "/dashboard/agents/**": ["./content/agents/**/*"],
  },
};

export default nextConfig;
