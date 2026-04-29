/** Questions / réponses prédéfinies (cahier des charges : chatbot avec FAQ avant API tierce). */

import type { Locale } from "@/i18n/messages";

export type SupportFaqItem = {
    id: string;
    question: string;
    answer: string;
    /** Mots-clés pour correspondance sur la saisie libre */
    keywords: string[];
};

export const SUPPORT_FAQ: SupportFaqItem[] = [
    {
        id: "soc",
        question: "Qu’est-ce que le SOC managé Cyna ?",
        answer:
            "Le SOC managé Cyna assure une supervision 24/7 de vos environnements : nos analystes surveillent les alertes, investiguent et coordonnent la réponse aux incidents, en complément de votre EDR / XDR.",
        keywords: ["soc", "managé", "supervision", "24/7", "analyste"],
    },
    {
        id: "edr",
        question: "En quoi l’EDR Cyna Pro protège-t-il mes postes ?",
        answer:
            "L’offre EDR & Digital Workplace (comme sur cyna-it.fr) couvre la protection managée des postes, serveurs et utilisateurs, avec déploiement simplifié et intégration à votre EDR existant.",
        keywords: ["edr", "endpoint", "poste", "terminal", "malware"],
    },
    {
        id: "xdr",
        question: "Qu’apporte le XDR par rapport à l’EDR seul ?",
        answer:
            "Le XDR étend la corrélation sur plusieurs sources (endpoints, cloud, réseau selon périmètre) pour une vision unifiée des incidents et des investigations plus rapides.",
        keywords: ["xdr", "corrélation", "visibilité", "unifié"],
    },
    {
        id: "tarifs",
        question: "Comment sont calculés les tarifs ?",
        answer:
            "Les prix affichés sur la boutique correspondent à des abonnements mensuels ou annuels par produit. Le détail est sur chaque fiche produit ; la facturation suit votre panier au checkout.",
        keywords: ["tarif", "prix", "abonnement", "facture", "coût"],
    },
    {
        id: "contact",
        question: "Comment contacter le support ?",
        answer:
            "Utilisez le formulaire sur cette page, ou écrivez à l’adresse indiquée sur cyna-it.fr. Pour l’urgence incident, précisez-le dans le sujet du message.",
        keywords: ["contact", "support", "aide", "email", "téléphone"],
    },
];

export const SUPPORT_FAQ_EN: SupportFaqItem[] = [
    {
        id: "soc",
        question: "What is the Cyna managed SOC?",
        answer:
            "The Cyna managed SOC provides 24/7 monitoring of your environments: our analysts watch alerts, investigate, and coordinate incident response alongside your EDR / XDR.",
        keywords: ["soc", "managed", "monitoring", "24/7", "analyst"],
    },
    {
        id: "edr",
        question: "How does Cyna EDR Pro protect my endpoints?",
        answer:
            "The EDR & Digital Workplace offer covers managed protection for workstations, servers, and users, with streamlined deployment and integration with your existing EDR.",
        keywords: ["edr", "endpoint", "workstation", "malware", "device"],
    },
    {
        id: "xdr",
        question: "What does XDR add compared to EDR alone?",
        answer:
            "XDR extends correlation across multiple sources (endpoints, cloud, network as applicable) for a unified view of incidents and faster investigations.",
        keywords: ["xdr", "correlation", "visibility", "unified"],
    },
    {
        id: "tarifs",
        question: "How are prices calculated?",
        answer:
            "Prices shown in the store correspond to monthly or annual subscriptions per product. Details are on each product page; billing follows your cart at checkout.",
        keywords: ["price", "pricing", "subscription", "invoice", "cost"],
    },
    {
        id: "contact",
        question: "How do I contact support?",
        answer:
            "Use the form on this page or the contact details on cyna-it.fr. For an incident emergency, state it clearly in the subject line.",
        keywords: ["contact", "support", "help", "email", "phone"],
    },
];

export function supportFaqForLocale(locale: Locale): SupportFaqItem[] {
    return locale === "en" ? SUPPORT_FAQ_EN : SUPPORT_FAQ;
}

export function matchPredefinedAnswer(input: string, locale: Locale = "fr"): string | null {
    const t = input.toLowerCase().trim();
    if (t.length < 2) return null;

    const faq = supportFaqForLocale(locale);
    for (const item of faq) {
        if (item.keywords.some((k) => t.includes(k))) {
            return item.answer;
        }
    }
    return null;
}
