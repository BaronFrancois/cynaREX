import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1h

export interface CisaVulnerability {
    cveID: string;
    vendorProject: string;
    product: string;
    vulnerabilityName: string;
    dateAdded: string;
    shortDescription: string;
    knownRansomwareCampaignUse: string;
}

function translateToFrench(text: string): string {
    if (!text) return text;
    
    // Remplacements pour les titres et descriptions communs de failles
    const dictionary: [RegExp, string][] = [
        [/Vulnerability/g, "Vulnérabilité"],
        [/vulnerability/g, "vulnérabilité"],
        [/Download of Code Without Integrity Check/g, "Téléchargement de code sans vérification d'intégrité"],
        [/download of code without integrity check/gi, "téléchargement de code sans vérification d'intégrité"],
        [/Use-After-Free/gi, "Utilisation après libération (Use-After-Free)"],
        [/Remote Code Execution/gi, "Exécution de code à distance (RCE)"],
        [/Privilege Escalation/gi, "Élévation de privilèges"],
        [/Authentication Bypass/gi, "Contournement d'authentification"],
        [/Cross-Site Scripting/gi, "Cross-Site Scripting (XSS)"],
        [/SQL Injection/gi, "Injection SQL"],
        [/Path Traversal/gi, "Parcours de répertoire"],
        [/Memory Corruption/gi, "Corruption de mémoire"],
        [/Out-of-Bounds/g, "Hors limites"],
        
        [/contains a/g, "contient une"],
        [/contains an/g, "contient une"],
        [/that could allow/g, "qui pourrait permettre à"],
        [/a remote attacker/g, "un attaquant distant"],
        [/an unauthenticated attacker/gi, "un attaquant non authentifié"],
        [/an attacker/g, "un attaquant"],
        [/who had compromised/g, "ayant compromis"],
        [/who is able to/g, "qui est capable de"],
        [/to execute arbitrary code/g, "d'exécuter du code arbitraire"],
        [/via a crafted/gi, "via un fichier/requête manipulé(e)"],
        [/influence the update delivery path/gi, "manipuler le chemin de livraison des mises à jour"],
        [/can substitute a tampered update payload/gi, "de substituer une charge utile (payload) corrompue"],
        [/to gain/g, "d'obtenir"],
        [/to bypass/g, "de contourner"],
        [/to access/g, "d'accéder à"],
        [/could affect/g, "pourrait affecter"],
        [/is unaware of/g, "n'a pas connaissance de"],
        [/due to/gi, "en raison de"],
        [/resulting in/gi, "entraînant"],
        [/leading to/gi, "menant à"],
    ];

    let translated = text;
    for (const [pattern, replacement] of dictionary) {
        translated = translated.replace(pattern, replacement);
    }
    return translated;
}

export async function GET() {
    try {
        const res = await fetch(
            "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
            { next: { revalidate: 3600 } }
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
        }

        const data = await res.json();

        // Retourner les 6 plus récentes en les traduisant à la volée
        const latest: CisaVulnerability[] = data.vulnerabilities
            .slice(0, 6)
            .map((v: CisaVulnerability) => ({
                cveID: v.cveID,
                vendorProject: v.vendorProject,
                product: v.product,
                vulnerabilityName: translateToFrench(v.vulnerabilityName),
                dateAdded: v.dateAdded,
                shortDescription: translateToFrench(v.shortDescription),
                knownRansomwareCampaignUse: v.knownRansomwareCampaignUse,
            }));

        return NextResponse.json({ vulnerabilities: latest, total: data.count });
    } catch {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
