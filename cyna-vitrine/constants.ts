import { Product } from "./src/types/produit";

/**
 * Offres calquées sur la communication publique de Cyna (https://cyna-it.fr/).
 * Les tarifs sont indicatifs / démo e-commerce — non contractuels.
 */
export const PRODUCTS: Product[] = [
  {
    id: "cyna-edr-pro",
    name: "EDR & Digital Workplace",
    shortDescription:
      "Protection managée de vos postes, serveurs et utilisateurs — déployée en quelques clics.",
    fullDescription:
      "Aligné sur l’offre Cyna : protégez les environnements de travail grâce au service managé de votre EDR et Digital Workplace. Déploiement simple, supervision adaptée aux MSP et aux PME. Intégration avec votre stack existante (ex. SentinelOne, selon périmètre).",
    price: 19.99,
    period: "monthly",
    category: "EDR",
    features: [
      "Postes, serveurs & utilisateurs",
      "Déploiement guidé (intégration en 2 clics)",
      "Service managé partenaire MSP",
      "Remédiation & visibilité endpoint",
    ],
    status: "available",
    image: "https://picsum.photos/id/1/800/600",
  },
  {
    id: "cyna-xdr-max",
    name: "Détection étendue & corrélation (XDR)",
    shortDescription:
      "Visibilité unifiée et corrélation multi-sources — au-delà du seul endpoint.",
    fullDescription:
      "Prolonge la logique « un EDR ne suffit pas » : corrélez les signaux pour une détection étendue (endpoints, charges cloud et périmètres connectés selon offre). Pensé pour compléter le SOC managé et la plateforme Cyna.",
    price: 49.99,
    period: "monthly",
    category: "XDR",
    features: [
      "Corrélation d’incidents multi-sources",
      "Chasse et investigation",
      "Réduction du bruit / priorisation",
      "Alignement avec les équipes SOC",
    ],
    status: "available",
    image: "https://picsum.photos/id/2/800/600",
  },
  {
    id: "cyna-soc-managed",
    name: "SOC managé 24/7",
    shortDescription:
      "Analystes SOC qui surveillent, investiguent et agissent 24h/24 — basé en France.",
    fullDescription:
      "Au cœur de l’offre Cyna : un SOC managé français, avec supervision continue des systèmes d’information. Vos alertes sont traitées par des analystes, pour dormir tranquille tout en gardant une relation proximité avec le CERT en cas d’incident.",
    price: 999.0,
    period: "monthly",
    category: "SOC",
    features: [
      "Supervision & investigation 24/7",
      "Analystes SOC dédiés",
      "Rapports & suivi partenaire MSP",
      "Montée en charge vers le CERT",
    ],
    status: "available",
    image: "https://picsum.photos/id/3/800/600",
  },
  {
    id: "cyna-platform",
    name: "Cyna Platform",
    shortDescription:
      "Pilotage de l’ensemble de vos clients : vulnérabilités, rapports mensuels, vue consolidée.",
    fullDescription:
      "La plateforme présentée sur cyna-it.fr : pilotez vos environnements, exploitez un tableau des vulnérabilités et des livrables prêts à partager avec vos clients. Conçue pour les MSP qui industrialisent la cybersécurité.",
    price: 149.0,
    period: "monthly",
    category: "XDR",
    features: [
      "Pilotage multi-clients",
      "Tableau des vulnérabilités",
      "Rapports mensuels exportables",
      "Vision consolidée pour le management",
    ],
    status: "available",
    image: "https://picsum.photos/id/4/800/600",
  },
  {
    id: "cyna-cert-reponse",
    name: "Réponse à incident (CERT)",
    shortDescription:
      "Intervention 24/7 du CERT en France pour contenir et éradiquer la menace.",
    fullDescription:
      "En cas d’incident, les équipes CERT interviennent pour coordonner la réponse : limitation de l’impact, éradication et retour à un état sûr. Complément naturel du SOC managé, comme décrit sur le site Cyna.",
    price: 2499.0,
    period: "yearly",
    category: "SOC",
    features: [
      "Intervention CERT 24/7",
      "Coordination de crise",
      "Expertise France",
      "Restauration & recommandations",
    ],
    status: "available",
    image: "https://picsum.photos/id/5/800/600",
  },
  {
    id: "cyna-pentest",
    name: "Pentest (Black & Grey Box)",
    shortDescription:
      "Simulation d’attaque et évaluation offensive pour valider votre résilience.",
    fullDescription:
      "S’appuie sur les retours d’expérience et cas clients Cyna : tests d’intrusion, identification des failles et plan de remédiation. Idéal pour répondre aux exigences clients ou réglementaires (sensibilisation NIS2, etc.).",
    price: 4500.0,
    period: "yearly",
    category: "EDR",
    features: [
      "Scénarios Black / Grey Box",
      "Rapport détaillé & prioritisation",
      "Accompagnement post-test",
      "Alignement conformité & risques",
    ],
    status: "available",
    image: "https://picsum.photos/id/6/800/600",
  },
];

export const MOCK_USER = {
  name: "Alexandre Chen",
  email: "alex.chen@example.com",
  company: "TechFlow Inc.",
  activeSubscriptions: 2,
  nextBillingDate: "15 Oct 2023",
};
