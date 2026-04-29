import type { Locale } from "@/i18n/messages";

export type SupportPageUi = {
    heroTitle: string;
    heroSearchPlaceholder: string;
    faqTitle: string;
    contactHeading: string;
    contactSentTitle: string;
    contactSentBody: string;
    contactSentAgain: string;
    emailLabel: string;
    emailPh: string;
    emailInvalid: string;
    subjectLabel: string;
    subjectRequired: string;
    messageLabel: string;
    messageShort: string;
    messagePh: string;
    sending: string;
    sendBtn: string;
    assistantTitle: string;
    assistantBody: string;
    startChat: string;
    chatTitle: string;
    closeChatAria: string;
    chatEmpty: string;
    chatInputPh: string;
    chatInputAria: string;
    sendMessageAria: string;
    subjectOptions: readonly string[];
};

const fr: SupportPageUi = {
    heroTitle: "Comment pouvons-nous vous aider ?",
    heroSearchPlaceholder: "Rechercher des sujets d'aide…",
    faqTitle: "Questions fréquentes",
    contactHeading: "Contactez-nous",
    contactSentTitle: "Message envoyé !",
    contactSentBody:
        "Notre équipe vous répondra dans les plus brefs délais à l'adresse indiquée.",
    contactSentAgain: "Envoyer un autre message",
    emailLabel: "Email",
    emailPh: "votre@email.fr",
    emailInvalid: "Adresse email invalide",
    subjectLabel: "Sujet",
    subjectRequired: "Veuillez choisir un sujet",
    messageLabel: "Message",
    messageShort: "Le message doit contenir au moins 10 caractères",
    messagePh: "Décrivez votre demande…",
    sending: "Envoi en cours…",
    sendBtn: "Envoyer le message",
    assistantTitle: "Assistant IA Cyna",
    assistantBody:
        "Obtenez des réponses instantanées sur nos produits et services grâce à notre IA avancée.",
    startChat: "Démarrer le Chat",
    chatTitle: "IA Cyna",
    closeChatAria: "Fermer la fenêtre de discussion",
    chatEmpty: "Posez-moi des questions sur Cyna EDR, XDR ou les tarifs.",
    chatInputPh: "Écrivez un message…",
    chatInputAria: "Message au chatbot",
    sendMessageAria: "Envoyer le message",
    subjectOptions: [
        "Problème Technique",
        "Question Facturation",
        "Demande Commerciale",
        "Assistance générale",
    ],
};

const en: SupportPageUi = {
    heroTitle: "How can we help?",
    heroSearchPlaceholder: "Search help topics…",
    faqTitle: "Frequently asked questions",
    contactHeading: "Contact us",
    contactSentTitle: "Message sent!",
    contactSentBody: "Our team will get back to you shortly at the address you provided.",
    contactSentAgain: "Send another message",
    emailLabel: "Email",
    emailPh: "you@example.com",
    emailInvalid: "Invalid email address",
    subjectLabel: "Subject",
    subjectRequired: "Please choose a subject",
    messageLabel: "Message",
    messageShort: "The message must be at least 10 characters",
    messagePh: "Describe your request…",
    sending: "Sending…",
    sendBtn: "Send message",
    assistantTitle: "Cyna AI assistant",
    assistantBody: "Get instant answers about our products and services with our AI assistant.",
    startChat: "Start chat",
    chatTitle: "Cyna AI",
    closeChatAria: "Close chat window",
    chatEmpty: "Ask me about Cyna EDR, XDR, or pricing.",
    chatInputPh: "Type a message…",
    chatInputAria: "Message to the assistant",
    sendMessageAria: "Send message",
    subjectOptions: [
        "Technical issue",
        "Billing question",
        "Sales enquiry",
        "General assistance",
    ],
};

export function supportPageUi(locale: Locale): SupportPageUi {
    return locale === "en" ? en : fr;
}
