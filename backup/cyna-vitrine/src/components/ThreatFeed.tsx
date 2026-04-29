"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Shield, Clock, ExternalLink } from "lucide-react";
import type { CisaVulnerability } from "@/app/api/threats/route";

interface ThreatFeedData {
    vulnerabilities: CisaVulnerability[];
    total: number;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function RansomwareBadge({ use }: { use: string }) {
    if (use === "Known") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3" />
                Ransomware actif
            </span>
        );
    }
    return null;
}

export default function ThreatFeed() {
    const [data, setData] = useState<ThreatFeedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/threats")
            .then((r) => r.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <section className="py-24 bg-gray-950 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Titre hook */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/40 border border-red-700/50 text-red-400 text-sm font-mono mb-6">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Flux en direct — Source CISA KEV
                    </div>
                    <h2 className="cyna-heading text-gray-100 mb-6">
                        Pendant que vous lisez ces lignes,
                        <br />
                        <span className="text-red-500">des systèmes sont compromis.</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Ces vulnérabilités sont <strong className="text-white">activement exploitées</strong> en ce
                        moment dans le monde. Cyna vous protège avant qu'elles n'atteignent vos infrastructures.
                    </p>
                    {data && (
                        <p className="mt-3 text-sm text-gray-500">
                            {data.total.toLocaleString("fr-FR")} vulnérabilités répertoriées par la CISA à ce jour
                        </p>
                    )}
                </div>

                {/* Grille */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-48 rounded-2xl bg-gray-800/50 animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 text-gray-500">
                        <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Flux temporairement indisponible.</p>
                    </div>
                )}

                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.vulnerabilities.map((v) => (
                            <div
                                key={v.cveID}
                                className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-red-800/60 transition-colors duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-mono text-sm text-cyna-500 font-semibold">
                                        {v.cveID}
                                    </span>
                                    <RansomwareBadge use={v.knownRansomwareCampaignUse} />
                                </div>

                                {/* Produit */}
                                <div>
                                    <p className="text-white font-semibold text-sm leading-snug">
                                        {v.vulnerabilityName}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {v.vendorProject} — {v.product}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-3">
                                    {v.shortDescription}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <Clock className="w-3 h-3" />
                                        Ajouté le {formatDate(v.dateAdded)}
                                    </div>
                                    <a
                                        href={`https://nvd.nist.gov/vuln/detail/${v.cveID}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-cyna-500 transition-colors"
                                        aria-label="Voir sur NVD"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-14 text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        Vos systèmes sont-ils exposés à l'une de ces menaces ?
                    </p>
                    <a
                        href="/support"
                        className="inline-flex items-center gap-2 bg-cyna-600 hover:bg-cyna-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors duration-200"
                    >
                        <Shield className="w-4 h-4" />
                        Obtenir un audit gratuit
                    </a>
                </div>
            </div>
        </section>
    );
}
