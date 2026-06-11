export type FaqCategory = {
  id: string;
  label: string;
};

export type FaqItem = {
  id: string;
  category: string;
  q: string;
  a: string;
};

import type { Locale } from "./i18n/config";

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "start", label: "Pour commencer" },
  { id: "marketplace", label: "Marketplace & agents 4,90 €" },
  { id: "payment", label: "Paiement & sécurité" },
  { id: "questionnaire", label: "Le questionnaire" },
  { id: "account", label: "Mon compte" },
  { id: "agent", label: "Mon agent" },
  { id: "support", label: "Support & problèmes" },
];

// ⚠ Ordre = priorité d'affichage. Les premières questions sont celles qui rassurent le plus
// un visiteur avant achat. Aucune promesse de résultat financier, aucune fausse garantie.
export const FAQ_ITEMS: FaqItem[] = [
  // ============================================================
  // 1. POUR COMMENCER — réassurance avant achat
  // ============================================================
  {
    id: "how-it-works",
    category: "start",
    q: "Comment fonctionne MonAgentPerso ?",
    a: "Vous créez un compte, vous répondez à un questionnaire d'environ 3 minutes sur votre métier, vous payez 49,90€ via Stripe, et vous recevez votre agent IA personnalisé sous 24h par email et dans votre espace utilisateur.",
  },
  {
    id: "what-is-a-personalized-agent",
    category: "start",
    q: "Qu'est-ce qu'un agent IA personnalisé, exactement ?",
    a: "C'est un assistant configuré pour votre métier, votre style de communication et vos cas d'usage. Au lieu de réexpliquer votre contexte à chaque conversation avec un ChatGPT générique, votre agent garde tout en mémoire : règles, ton, exemples, livrables types.",
  },
  {
    id: "why-not-chatgpt",
    category: "start",
    q: "Pourquoi ne pas utiliser ChatGPT directement ?",
    a: "Vous pouvez. Mais à chaque conversation, vous devez décrire votre métier, vos règles et votre ton. Un agent personnalisé garde tout ça en mémoire — vous gagnez du temps sur chaque demande et les réponses collent mieux à votre quotidien.",
  },
  {
    id: "delivery-time",
    category: "start",
    q: "En combien de temps je reçois mon agent ?",
    a: "Sous 24h maximum après le paiement. Vous le recevez par email à l'adresse de votre compte, et il apparaît automatiquement dans la section « Mon agent » de votre espace utilisateur.",
  },
  {
    id: "price",
    category: "start",
    q: "Combien ça coûte ?",
    a: "49,90€ TTC en offre de lancement (au lieu de 79,90€). C'est un paiement unique, pas un abonnement.",
  },
  {
    id: "questionnaire-duration",
    category: "start",
    q: "Combien de temps prend le questionnaire ?",
    a: "Environ 3 minutes. Il est guidé étape par étape, avec une barre de progression visible et des questions courtes. Vous pouvez revenir en arrière à tout moment.",
  },
  {
    id: "platform-choice",
    category: "start",
    q: "Sur quelle plateforme fonctionne mon agent ?",
    a: "Au choix : ChatGPT (sous forme de GPT personnalisé), Claude (Claude.md) ou Gemini (Gemini Gem). Vous indiquez votre préférence dans le questionnaire. Si vous hésitez, nous vous conseillons selon votre métier.",
  },
  {
    id: "no-tech-skill",
    category: "start",
    q: "Faut-il être à l'aise avec l'IA pour utiliser mon agent ?",
    a: "Non. L'agent s'utilise comme une conversation normale : vous tapez votre demande en langage naturel, l'agent répond. Aucune compétence technique requise, aucune installation à faire.",
  },
  {
    id: "professional-fit",
    category: "start",
    q: "Est-ce que c'est adapté à mon métier ?",
    a: "Le service est conçu pour les professionnels indépendants, TPE/PME et freelances qui produisent régulièrement des livrables écrits ou répétitifs (emails, devis, comptes-rendus, posts, réponses clients, contenus, synthèses…). Si votre métier comporte ces tâches, l'agent vous fera gagner du temps.",
  },
  {
    id: "team-use",
    category: "start",
    q: "Mon agent fonctionnera-t-il pour mon équipe entière ?",
    a: "L'agent est lié au compte ChatGPT, Claude ou Gemini sur lequel vous le configurez. Pour un usage en équipe, cela dépend du plan choisi sur la plateforme (versions Team / Workspace existent).",
  },

  // ============================================================
  // 1bis. MARKETPLACE & AGENTS PRÊTS À L'EMPLOI (4,90 €)
  // ============================================================
  {
    id: "what-marketplace",
    category: "marketplace",
    q: "Qu'est-ce que la marketplace d'agents prêts à l'emploi ?",
    a: "C'est un catalogue d'agents IA déjà conçus et sur-entraînés pour une mission précise : Humanizer, CV, Dissertation, Résumeur, Fiches & Quiz, Meta-Prompt, Prépa entretien, Slides… Vous les débloquez à l'unité pour 4,90 € et les utilisez immédiatement dans ChatGPT ou Claude.",
  },
  {
    id: "ready-vs-custom",
    category: "marketplace",
    q: "Quelle différence avec l'agent personnalisé à 49,90 € ?",
    a: "Les agents prêts à l'emploi (4,90 €) sont génériques mais excellents, livrés instantanément après paiement. L'agent personnalisé (49,90 €) est créé sur-mesure pour VOTRE métier à partir de votre questionnaire, et livré sous 24h. Les deux sont complémentaires.",
  },
  {
    id: "gpt-or-claude",
    category: "marketplace",
    q: "Version ChatGPT ou Claude : laquelle choisir ?",
    a: "Chaque agent existe en deux versions. Au moment de débloquer, vous choisissez ChatGPT ou Claude, et vous recevez uniquement la version choisie (ses instructions dédiées + la base de connaissance). Prenez simplement la version de l'outil que vous utilisez au quotidien.",
  },
  {
    id: "what-i-get-490",
    category: "marketplace",
    q: "Que reçois-je exactement après un achat à 4,90 € ?",
    a: "Les instructions complètes de l'agent (à coller dans un GPT personnalisé sur ChatGPT, ou dans un Projet sur Claude) ainsi que sa base de connaissance au format PDF. Tout est accessible immédiatement dans votre espace, section « Ma bibliothèque ».",
  },
  {
    id: "where-find-agent",
    category: "marketplace",
    q: "Où retrouver un agent que j'ai acheté ?",
    a: "Dans votre espace utilisateur, section « Ma bibliothèque ». Vous y filtrez vos achats par type (Agents GPT, Agents Claude…) et ouvrez chaque agent pour copier ses instructions et télécharger son PDF.",
  },
  {
    id: "how-install-ready",
    category: "marketplace",
    q: "Comment installer un agent prêt à l'emploi ?",
    a: "En 2 minutes : créez un GPT (ChatGPT → Explorer les GPTs → Créer) ou un Projet (Claude → Projects → Create project), collez les instructions fournies dans le champ « Instructions », uploadez le PDF dans la base de connaissance, puis lancez la conversation.",
  },
  {
    id: "need-account-buy-490",
    category: "marketplace",
    q: "Dois-je avoir un compte pour débloquer un agent à 4,90 € ?",
    a: "Oui. Si vous n'êtes pas connecté, on vous invite d'abord à créer un compte — votre choix d'agent est mémorisé pour reprendre l'achat juste après. Ainsi, tous vos achats restent rattachés à votre espace.",
  },
  {
    id: "reuse-ready-agent",
    category: "marketplace",
    q: "Puis-je réutiliser l'agent autant de fois que je veux ?",
    a: "Oui. Une fois débloqué, l'agent reste disponible dans votre bibliothèque et s'utilise sans limite dans votre ChatGPT ou Claude. C'est un achat unique, sans abonnement.",
  },

  // ============================================================
  // 2. PAIEMENT & SÉCURITÉ
  // ============================================================
  {
    id: "secure-payment",
    category: "payment",
    q: "Le paiement est-il sécurisé ?",
    a: "Oui. Le paiement passe par Stripe, leader mondial du paiement en ligne, certifié PCI-DSS niveau 1. Vos coordonnées bancaires ne transitent jamais par les serveurs de MonAgentPerso.",
  },
  {
    id: "card-storage",
    category: "payment",
    q: "Stockez-vous mes coordonnées bancaires ?",
    a: "Non, jamais. MonAgentPerso n'accède pas à votre numéro de carte. Toute la partie bancaire est gérée par Stripe de manière chiffrée et conforme aux standards de l'industrie.",
  },
  {
    id: "payment-methods",
    category: "payment",
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Toutes les cartes bancaires acceptées par Stripe Checkout : Visa, Mastercard, American Express, ainsi que les principales solutions de paiement disponibles selon votre région.",
  },
  {
    id: "invoice",
    category: "payment",
    q: "Vais-je recevoir une facture ou un reçu ?",
    a: "Oui. Stripe vous envoie automatiquement un reçu par email immédiatement après le paiement, à l'adresse renseignée lors du checkout.",
  },
  {
    id: "payment-failed",
    category: "payment",
    q: "Que se passe-t-il si mon paiement échoue ?",
    a: "Aucun débit n'est effectué et aucune commande n'est enregistrée. Vous pouvez réessayer directement depuis la page de paiement ou depuis votre espace utilisateur, sans aucun impact.",
  },
  {
    id: "refund-policy",
    category: "payment",
    q: "Puis-je me faire rembourser ?",
    a: "Un remboursement peut être étudié au cas par cas, notamment si l'agent n'a pas été livré dans les délais ou ne correspond manifestement pas au brief fourni dans le questionnaire. Contactez-nous depuis votre espace utilisateur pour ouvrir une demande.",
  },

  // ============================================================
  // 3. LE QUESTIONNAIRE
  // ============================================================
  {
    id: "questionnaire-content",
    category: "questionnaire",
    q: "Quelles questions sont posées dans le questionnaire ?",
    a: "Votre métier, votre spécialité, vos tâches récurrentes, vos clients types, votre ton de communication, vos outils, vos règles métier, vos livrables habituels. Environ 25 questions guidées pour cerner précisément votre contexte.",
  },
  {
    id: "why-so-many-questions",
    category: "questionnaire",
    q: "Pourquoi autant de questions ?",
    a: "Plus l'agent connaît votre contexte, plus ses réponses sont précises et utilisables sans retouche. Chaque question sert directement à le personnaliser. Le questionnaire est conçu pour rester court et fluide.",
  },
  {
    id: "dont-know-what-to-answer",
    category: "questionnaire",
    q: "Et si je ne sais pas quoi répondre à une question ?",
    a: "Certaines questions sont optionnelles. Pour les autres, donnez votre première intuition ou les éléments dont vous disposez — c'est largement suffisant pour créer un agent pertinent.",
  },
  {
    id: "attach-documents",
    category: "questionnaire",
    q: "Puis-je joindre des documents (charte, exemples, brochure) ?",
    a: "Oui. À la dernière étape du questionnaire, vous pouvez déposer plusieurs fichiers (PDF, DOCX, TXT, MD, images). Plus vous fournissez d'exemples concrets de vos livrables, plus l'agent imitera votre style avec précision.",
  },
  {
    id: "answers-confidential",
    category: "questionnaire",
    q: "Mes réponses sont-elles confidentielles ?",
    a: "Oui. Vos réponses servent uniquement à créer votre agent personnalisé. Elles ne sont jamais diffusées, partagées ni utilisées à d'autres fins.",
  },
  {
    id: "modify-answers",
    category: "questionnaire",
    q: "Puis-je modifier mes réponses après l'envoi ?",
    a: "Les réponses sont figées au moment du paiement pour permettre la création de l'agent. Si vous souhaitez ajuster un élément après livraison, contactez-nous depuis votre espace utilisateur.",
  },

  // ============================================================
  // 4. MON COMPTE
  // ============================================================
  {
    id: "why-create-account",
    category: "account",
    q: "Pourquoi dois-je créer un compte ?",
    a: "Pour retrouver votre agent et le suivi de votre commande dans votre espace utilisateur, et pour sécuriser l'accès à vos informations personnelles. Le compte est gratuit et sans engagement.",
  },
  {
    id: "how-to-login",
    category: "account",
    q: "Comment je me connecte ?",
    a: "Cliquez sur « Connexion » en haut à droite, puis saisissez votre email et votre mot de passe. Si vous n'avez pas encore de compte, vous pouvez en créer un en quelques secondes.",
  },
  {
    id: "forgot-password",
    category: "account",
    q: "J'ai oublié mon mot de passe.",
    a: "La réinitialisation autonome arrive prochainement. En attendant, contactez-nous depuis l'adresse email de votre commande et nous vous aiderons à récupérer l'accès.",
  },
  {
    id: "delete-account",
    category: "account",
    q: "Comment supprimer mon compte ?",
    a: "Faites-en la demande depuis votre espace utilisateur ou par email. Votre compte et les données associées sont supprimés sous 30 jours maximum.",
  },
  {
    id: "wrong-email",
    category: "account",
    q: "J'ai indiqué une mauvaise adresse email, que faire ?",
    a: "Contactez-nous au plus vite avec votre adresse correcte et la preuve du paiement (numéro de session Stripe ou reçu reçu par mail). Nous mettrons à jour la livraison de votre agent.",
  },

  // ============================================================
  // 5. MON AGENT
  // ============================================================
  {
    id: "how-i-receive-agent",
    category: "agent",
    q: "Comment je reçois mon agent ?",
    a: "De deux façons complémentaires : par email à l'adresse de votre compte, et directement dans la section « Mon agent » de votre espace utilisateur. Le lien d'accès et les instructions sont fournis dans les deux cas.",
  },
  {
    id: "need-chatgpt-account",
    category: "agent",
    q: "Faut-il un compte ChatGPT, Claude ou Gemini pour utiliser mon agent ?",
    a: "Oui. Selon la plateforme choisie dans le questionnaire, vous devez avoir un compte sur le service correspondant. Pour démarrer, la version gratuite est généralement suffisante dans la plupart des cas d'usage.",
  },
  {
    id: "how-to-use-daily",
    category: "agent",
    q: "Comment j'utilise mon agent au quotidien ?",
    a: "Vous l'ouvrez via le lien fourni dans votre espace. Vous lui parlez en langage naturel (« Rédige-moi un email pour relancer un client »), ou via les commandes courtes / qui sont définies pour votre métier (ex : /annonce, /devis, /repondre).",
  },
  {
    id: "types-of-deliverables",
    category: "agent",
    q: "Mon agent peut-il rédiger des emails, devis, posts, comptes-rendus ?",
    a: "Oui, c'est précisément son usage principal. Le type exact de livrables que votre agent prend en charge dépend de ce que vous avez précisé dans le questionnaire (rôle attendu, livrables habituels, ton souhaité).",
  },
  {
    id: "can-it-invent",
    category: "agent",
    q: "Mon agent peut-il inventer des informations ?",
    a: "Les modèles d'IA peuvent parfois extrapoler ou se tromper. Votre agent est cadré pour respecter vos règles métier, citer ce qu'il sait et signaler ce qui manque, mais nous recommandons une relecture humaine systématique avant tout envoi à un client.",
  },
  {
    id: "replace-my-job",
    category: "agent",
    q: "Est-ce que l'agent remplace mon métier ou mon expertise ?",
    a: "Non. L'agent est un assistant : il prépare, brouillonne, structure et fait gagner du temps sur les tâches répétitives. Vous restez décisionnaire — c'est vous qui validez, ajustez et signez. Votre expertise reste centrale.",
  },
  {
    id: "agent-evolves",
    category: "agent",
    q: "Mon agent évoluera-t-il avec le temps ?",
    a: "L'agent livré est figé sur les informations que vous avez transmises. Si votre activité évolue ou si vous souhaitez l'enrichir avec de nouvelles règles, contactez-nous depuis votre espace pour discuter d'une mise à jour.",
  },

  // ============================================================
  // 6. SUPPORT & PROBLÈMES
  // ============================================================
  {
    id: "not-received-24h",
    category: "support",
    q: "Je n'ai pas reçu mon agent sous 24h, que faire ?",
    a: "Vérifiez d'abord vos courriers indésirables et la section « Mon agent » de votre espace utilisateur. Si vous ne voyez toujours rien après 24h depuis le paiement, contactez-nous depuis votre espace.",
  },
  {
    id: "agent-not-as-expected",
    category: "support",
    q: "Mon agent ne fait pas exactement ce que je voulais.",
    a: "Décrivez-nous précisément ce qui ne convient pas (ton, format, contenu, comportement). Si l'écart est cohérent avec votre brief initial, nous procédons à un ajustement de l'agent.",
  },
  {
    id: "contact-support",
    category: "support",
    q: "Comment vous contacter ?",
    a: "Depuis votre espace utilisateur, ou directement par réponse à l'email de confirmation de commande. Nous répondons en général sous 24h ouvrés.",
  },
  {
    id: "trustworthy-service",
    category: "support",
    q: "MonAgentPerso est-il un service sérieux ?",
    a: "Oui. Nous proposons un parcours simple et transparent, un prix fixe affiché, un paiement sécurisé via Stripe, un délai de livraison clair (24h) et une réception confirmée à la fois par email et dans votre espace. Vous gardez le contrôle complet sur vos données.",
  },
];

// ============================================================
// ENGLISH
// ============================================================
export const FAQ_CATEGORIES_EN: FaqCategory[] = [
  { id: "start", label: "Getting started" },
  { id: "marketplace", label: "Marketplace & €4.90 agents" },
  { id: "payment", label: "Payment & security" },
  { id: "questionnaire", label: "The questionnaire" },
  { id: "account", label: "My account" },
  { id: "agent", label: "My agent" },
  { id: "support", label: "Support & issues" },
];

export const FAQ_ITEMS_EN: FaqItem[] = [
  {
    id: "how-it-works",
    category: "start",
    q: "How does MonAgentPerso work?",
    a: "You create an account, answer a roughly 3-minute questionnaire about your profession, pay €49.90 via Stripe, and receive your personalized AI agent within 24h by email and in your account area.",
  },
  {
    id: "what-is-a-personalized-agent",
    category: "start",
    q: "What exactly is a personalized AI agent?",
    a: "It's an assistant configured for your profession, your communication style and your use cases. Instead of re-explaining your context in every conversation with a generic ChatGPT, your agent keeps everything in memory: rules, tone, examples, typical deliverables.",
  },
  {
    id: "why-not-chatgpt",
    category: "start",
    q: "Why not just use ChatGPT directly?",
    a: "You can. But in every conversation you have to describe your job, your rules and your tone. A personalized agent keeps all that in memory — you save time on every request and the answers fit your daily reality better.",
  },
  {
    id: "delivery-time",
    category: "start",
    q: "How long until I receive my agent?",
    a: "Within 24h maximum after payment. You receive it by email at your account address, and it automatically appears in the “My agent” section of your account area.",
  },
  {
    id: "price",
    category: "start",
    q: "How much does it cost?",
    a: "€49.90 incl. tax as a launch offer (instead of €79.90). It's a one-time payment, not a subscription.",
  },
  {
    id: "questionnaire-duration",
    category: "start",
    q: "How long does the questionnaire take?",
    a: "About 3 minutes. It's guided step by step, with a visible progress bar and short questions. You can go back at any time.",
  },
  {
    id: "platform-choice",
    category: "start",
    q: "Which platform does my agent run on?",
    a: "Your choice: ChatGPT (as a custom GPT), Claude (Claude.md) or Gemini (Gemini Gem). You state your preference in the questionnaire. If you're unsure, we advise you based on your profession.",
  },
  {
    id: "no-tech-skill",
    category: "start",
    q: "Do I need to be comfortable with AI to use my agent?",
    a: "No. The agent works like a normal conversation: you type your request in natural language, the agent replies. No technical skills required, nothing to install.",
  },
  {
    id: "professional-fit",
    category: "start",
    q: "Is it suited to my profession?",
    a: "The service is built for independent professionals, small businesses and freelancers who regularly produce written or repetitive deliverables (emails, quotes, reports, posts, client replies, content, summaries…). If your job involves these tasks, the agent will save you time.",
  },
  {
    id: "team-use",
    category: "start",
    q: "Will my agent work for my whole team?",
    a: "The agent is tied to the ChatGPT, Claude or Gemini account where you set it up. For team use, it depends on the plan chosen on the platform (Team / Workspace versions exist).",
  },
  {
    id: "what-marketplace",
    category: "marketplace",
    q: "What is the ready-to-use agents marketplace?",
    a: "It's a catalog of AI agents already designed and trained for a specific task: Humanizer, CV, Essay, Summarizer, Flashcards & Quizzes, Meta-Prompt, Interview prep, Slides… You unlock them individually for €4.90 and use them right away in ChatGPT or Claude.",
  },
  {
    id: "ready-vs-custom",
    category: "marketplace",
    q: "What's the difference with the €49.90 personalized agent?",
    a: "The ready-to-use agents (€4.90) are generic but excellent, delivered instantly after payment. The personalized agent (€49.90) is built bespoke for YOUR profession from your questionnaire, and delivered within 24h. The two are complementary.",
  },
  {
    id: "gpt-or-claude",
    category: "marketplace",
    q: "ChatGPT or Claude version: which should I choose?",
    a: "Each agent comes in two versions. When unlocking, you choose ChatGPT or Claude, and you receive only the chosen version (its dedicated instructions + knowledge base). Simply pick the version of the tool you use daily.",
  },
  {
    id: "what-i-get-490",
    category: "marketplace",
    q: "What exactly do I get after a €4.90 purchase?",
    a: "The agent's full instructions (to paste into a custom GPT on ChatGPT, or a Project on Claude) plus its knowledge base as a PDF. Everything is available immediately in your space, “My library” section.",
  },
  {
    id: "where-find-agent",
    category: "marketplace",
    q: "Where do I find an agent I bought?",
    a: "In your account area, “My library” section. There you filter your purchases by type (GPT agents, Claude agents…) and open each agent to copy its instructions and download its PDF.",
  },
  {
    id: "how-install-ready",
    category: "marketplace",
    q: "How do I install a ready-to-use agent?",
    a: "In 2 minutes: create a GPT (ChatGPT → Explore GPTs → Create) or a Project (Claude → Projects → Create project), paste the provided instructions into the “Instructions” field, upload the PDF to the knowledge base, then start the conversation.",
  },
  {
    id: "need-account-buy-490",
    category: "marketplace",
    q: "Do I need an account to unlock a €4.90 agent?",
    a: "Yes. If you're not logged in, you're first invited to create an account — your agent choice is saved so you can resume the purchase right after. That way all your purchases stay linked to your space.",
  },
  {
    id: "reuse-ready-agent",
    category: "marketplace",
    q: "Can I reuse the agent as many times as I want?",
    a: "Yes. Once unlocked, the agent stays available in your library and can be used without limit in your ChatGPT or Claude. It's a one-time purchase, no subscription.",
  },
  {
    id: "secure-payment",
    category: "payment",
    q: "Is payment secure?",
    a: "Yes. Payment goes through Stripe, the global leader in online payments, certified PCI-DSS level 1. Your bank details never pass through MonAgentPerso's servers.",
  },
  {
    id: "card-storage",
    category: "payment",
    q: "Do you store my bank details?",
    a: "No, never. MonAgentPerso has no access to your card number. The entire payment side is handled by Stripe in an encrypted, industry-standard way.",
  },
  {
    id: "payment-methods",
    category: "payment",
    q: "Which payment methods do you accept?",
    a: "All cards accepted by Stripe Checkout: Visa, Mastercard, American Express, as well as the main payment solutions available in your region.",
  },
  {
    id: "invoice",
    category: "payment",
    q: "Will I receive an invoice or a receipt?",
    a: "Yes. Stripe automatically sends you a receipt by email right after payment, to the address provided at checkout.",
  },
  {
    id: "payment-failed",
    category: "payment",
    q: "What happens if my payment fails?",
    a: "No charge is made and no order is recorded. You can try again directly from the payment page or from your account area, with no impact.",
  },
  {
    id: "refund-policy",
    category: "payment",
    q: "Can I get a refund?",
    a: "A refund can be reviewed on a case-by-case basis, particularly if the agent was not delivered on time or clearly doesn't match the brief provided in the questionnaire. Contact us from your account area to open a request.",
  },
  {
    id: "questionnaire-content",
    category: "questionnaire",
    q: "What questions are asked in the questionnaire?",
    a: "Your profession, your specialty, your recurring tasks, your typical clients, your communication tone, your tools, your business rules, your usual deliverables. About 25 guided questions to precisely capture your context.",
  },
  {
    id: "why-so-many-questions",
    category: "questionnaire",
    q: "Why so many questions?",
    a: "The more the agent knows your context, the more precise and ready-to-use its answers are. Each question directly helps personalize it. The questionnaire is designed to stay short and smooth.",
  },
  {
    id: "dont-know-what-to-answer",
    category: "questionnaire",
    q: "What if I don't know what to answer to a question?",
    a: "Some questions are optional. For the others, give your first intuition or whatever you have — that's largely enough to create a relevant agent.",
  },
  {
    id: "attach-documents",
    category: "questionnaire",
    q: "Can I attach documents (guidelines, examples, brochure)?",
    a: "Yes. At the last step of the questionnaire, you can drop several files (PDF, DOCX, TXT, MD, images). The more concrete examples of your deliverables you provide, the more precisely the agent will mimic your style.",
  },
  {
    id: "answers-confidential",
    category: "questionnaire",
    q: "Are my answers confidential?",
    a: "Yes. Your answers are used only to create your personalized agent. They are never shared, distributed or used for any other purpose.",
  },
  {
    id: "modify-answers",
    category: "questionnaire",
    q: "Can I change my answers after submitting?",
    a: "Answers are locked at the moment of payment to allow the agent's creation. If you'd like to adjust something after delivery, contact us from your account area.",
  },
  {
    id: "why-create-account",
    category: "account",
    q: "Why do I have to create an account?",
    a: "To find your agent and track your order in your account area, and to secure access to your personal information. The account is free and with no commitment.",
  },
  {
    id: "how-to-login",
    category: "account",
    q: "How do I log in?",
    a: "Click “Log in” at the top right, then enter your email and password. If you don't have an account yet, you can create one in a few seconds.",
  },
  {
    id: "forgot-password",
    category: "account",
    q: "I forgot my password.",
    a: "Self-service reset is coming soon. In the meantime, contact us from the email address of your order and we'll help you regain access.",
  },
  {
    id: "delete-account",
    category: "account",
    q: "How do I delete my account?",
    a: "Request it from your account area or by email. Your account and the associated data are deleted within 30 days maximum.",
  },
  {
    id: "wrong-email",
    category: "account",
    q: "I entered the wrong email address, what should I do?",
    a: "Contact us as soon as possible with your correct address and proof of payment (Stripe session number or the receipt received by email). We'll update your agent's delivery.",
  },
  {
    id: "how-i-receive-agent",
    category: "agent",
    q: "How do I receive my agent?",
    a: "In two complementary ways: by email at your account address, and directly in the “My agent” section of your account area. The access link and instructions are provided in both cases.",
  },
  {
    id: "need-chatgpt-account",
    category: "agent",
    q: "Do I need a ChatGPT, Claude or Gemini account to use my agent?",
    a: "Yes. Depending on the platform chosen in the questionnaire, you need an account on the matching service. To get started, the free version is generally enough for most use cases.",
  },
  {
    id: "how-to-use-daily",
    category: "agent",
    q: "How do I use my agent day to day?",
    a: "You open it via the link provided in your space. You talk to it in natural language (“Write me an email to follow up with a client”), or via the short commands defined for your profession (e.g. /post, /quote, /reply).",
  },
  {
    id: "types-of-deliverables",
    category: "agent",
    q: "Can my agent write emails, quotes, posts, reports?",
    a: "Yes, that's precisely its main use. The exact type of deliverables your agent handles depends on what you specified in the questionnaire (expected role, usual deliverables, desired tone).",
  },
  {
    id: "can-it-invent",
    category: "agent",
    q: "Can my agent make up information?",
    a: "AI models can sometimes extrapolate or be wrong. Your agent is framed to respect your business rules, cite what it knows and flag what's missing, but we recommend a systematic human review before sending anything to a client.",
  },
  {
    id: "replace-my-job",
    category: "agent",
    q: "Does the agent replace my job or my expertise?",
    a: "No. The agent is an assistant: it prepares, drafts, structures and saves time on repetitive tasks. You stay the decision-maker — you validate, adjust and sign. Your expertise remains central.",
  },
  {
    id: "agent-evolves",
    category: "agent",
    q: "Will my agent evolve over time?",
    a: "The delivered agent is fixed on the information you provided. If your business evolves or you want to enrich it with new rules, contact us from your space to discuss an update.",
  },
  {
    id: "not-received-24h",
    category: "support",
    q: "I haven't received my agent within 24h, what should I do?",
    a: "First check your spam folder and the “My agent” section of your account area. If you still see nothing 24h after payment, contact us from your space.",
  },
  {
    id: "agent-not-as-expected",
    category: "support",
    q: "My agent doesn't do exactly what I wanted.",
    a: "Describe precisely what doesn't fit (tone, format, content, behavior). If the gap is consistent with your initial brief, we proceed with an adjustment of the agent.",
  },
  {
    id: "contact-support",
    category: "support",
    q: "How do I contact you?",
    a: "From your account area, or directly by replying to the order confirmation email. We usually respond within 24 business hours.",
  },
  {
    id: "trustworthy-service",
    category: "support",
    q: "Is MonAgentPerso a serious service?",
    a: "Yes. We offer a simple, transparent journey, a fixed displayed price, secure payment via Stripe, a clear delivery time (24h) and a confirmed receipt both by email and in your space. You keep full control over your data.",
  },
];

export function getFaqCategories(locale: Locale): FaqCategory[] {
  return locale === "en" ? FAQ_CATEGORIES_EN : FAQ_CATEGORIES;
}

export function getFaqItems(locale: Locale): FaqItem[] {
  return locale === "en" ? FAQ_ITEMS_EN : FAQ_ITEMS;
}
