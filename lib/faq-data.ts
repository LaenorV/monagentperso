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
