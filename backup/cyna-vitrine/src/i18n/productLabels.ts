import type { Product } from "@/types/produit";

type Locale = "fr" | "en";

type ProductTranslation = {
    name: string;
    shortDescription: string;
    fullDescription: string;
    features: string[];
};

const EN_OVERRIDES: Record<string, ProductTranslation> = {
    "cyna-edr-pro": {
        name: "EDR & Digital Workplace",
        shortDescription:
            "Managed protection for your workstations, servers and users — deployed in a few clicks.",
        fullDescription:
            "Aligned with the Cyna offering: protect your work environments with a managed EDR and Digital Workplace service. Easy deployment, MSP- and SMB-friendly monitoring. Integrates with your existing stack (e.g. SentinelOne, depending on scope).",
        features: [
            "Workstations, servers & users",
            "Guided deployment (2-click integration)",
            "Managed service with MSP partner",
            "Remediation & endpoint visibility",
        ],
    },
    "cyna-xdr-max": {
        name: "Extended detection & correlation (XDR)",
        shortDescription:
            "Unified visibility and multi-source correlation — beyond the endpoint alone.",
        fullDescription:
            "Extends the “a single EDR is not enough” approach: correlate signals for broader detection (endpoints, cloud workloads and connected perimeters per offer). Designed to complement the Cyna managed SOC and platform.",
        features: [
            "Multi-source incident correlation",
            "Threat hunting & investigation",
            "Noise reduction / prioritization",
            "Alignment with SOC teams",
        ],
    },
    "cyna-soc-managed": {
        name: "24/7 managed SOC",
        shortDescription:
            "SOC analysts monitoring, investigating and acting 24/7 — based in France.",
        fullDescription:
            "At the heart of the Cyna offering: a French managed SOC with continuous monitoring of your information systems. Your alerts are handled by analysts so you can sleep easy while keeping close access to the CERT for incident response.",
        features: [
            "24/7 monitoring & investigation",
            "Dedicated SOC analysts",
            "Reports & MSP partner follow-up",
            "Escalation path to the CERT",
        ],
    },
    "cyna-platform": {
        name: "Cyna Platform",
        shortDescription:
            "Operate all your clients: vulnerabilities, monthly reports, consolidated view.",
        fullDescription:
            "The platform showcased on cyna-it.fr: manage your environments, leverage a vulnerability dashboard and ready-to-share deliverables for your clients. Built for MSPs industrializing cybersecurity.",
        features: [
            "Multi-client management",
            "Vulnerability dashboard",
            "Exportable monthly reports",
            "Consolidated view for management",
        ],
    },
    "cyna-cert-reponse": {
        name: "Incident response (CERT)",
        shortDescription:
            "24/7 French CERT intervention to contain and eradicate the threat.",
        fullDescription:
            "In the event of an incident, the CERT teams coordinate the response: impact limitation, eradication and return to a safe state. A natural complement to the managed SOC, as described on the Cyna site.",
        features: [
            "24/7 CERT intervention",
            "Crisis coordination",
            "French expertise",
            "Recovery & recommendations",
        ],
    },
    "cyna-pentest": {
        name: "Pentest (Black & Grey Box)",
        shortDescription:
            "Attack simulation and offensive assessment to validate your resilience.",
        fullDescription:
            "Based on Cyna feedback and customer cases: intrusion tests, vulnerability identification and remediation plan. Ideal to meet customer or regulatory expectations (NIS2 awareness, etc.).",
        features: [
            "Black / Grey Box scenarios",
            "Detailed report & prioritization",
            "Post-test support",
            "Alignment with compliance & risk",
        ],
    },
};

export function localizeProduct(product: Product, locale: Locale): Product {
    if (locale !== "en") return product;
    const override = EN_OVERRIDES[product.id];
    if (!override) return product;
    return { ...product, ...override };
}

export function localizeCategory(category: string, locale: Locale): string {
    if (locale !== "en") return category;
    return category;
}
