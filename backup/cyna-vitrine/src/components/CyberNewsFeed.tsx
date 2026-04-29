"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { CisaVulnerability } from "@/app/api/threats/route";

interface ThreatFeedData {
    vulnerabilities: CisaVulnerability[];
    total: number;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function TileCard({ v, index }: { v: CisaVulnerability; index: number }) {
    const isRansomware = v.knownRansomwareCampaignUse === "Known";

    return (
        <a
            href={`https://nvd.nist.gov/vuln/detail/${v.cveID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-800 hover:shadow-xl hover:shadow-zinc-950/50 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyna-600"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* En-tête de la tile */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                    {isRansomware ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/50 text-red-400 border border-red-800">
                            <AlertTriangle className="w-3 h-3" />
                            Ransomware
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/50 text-cyna-500 border border-violet-800">
                            <ShieldAlert className="w-3 h-3" />
                            Exploitation active
                        </span>
                    )}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-0.5" />
            </div>

            {/* Nom de la vulnérabilité */}
            <h3 className="text-gray-100 font-semibold text-base leading-snug mb-2 group-hover:text-cyna-500 transition-colors line-clamp-2">
                {v.vulnerabilityName}
            </h3>

            {/* Éditeur / produit */}
            <p className="text-sm text-gray-400 mb-4">
                {v.vendorProject} — {v.product}
            </p>

            {/* Pied de tile */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                <span className="font-mono text-xs text-cyna-500 font-medium">
                    {v.cveID}
                </span>
                <span className="text-xs text-gray-400">
                    {formatDate(v.dateAdded)}
                </span>
            </div>
        </a>
    );
}

function TileSkeleton() {
    return (
        <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-800 animate-pulse">
            <div className="h-6 w-28 bg-zinc-800 rounded-full mb-4" />
            <div className="h-4 w-full bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-3/4 bg-zinc-800 rounded mb-4" />
            <div className="h-3 w-1/2 bg-zinc-800 rounded mb-4" />
            <div className="flex justify-between pt-4 border-t border-zinc-700">
                <div className="h-3 w-24 bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-800 rounded" />
            </div>
        </div>
    );
}

export default function CyberNewsFeed() {
    const [data, setData] = useState<ThreatFeedData | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch("/api/threats")
            .then((r) => r.json())
            .then(setData)
            .catch(() => setError(true));
    }, []);

    return (
        <section className="py-28 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* En-tête section */}
                <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-cyna-600 font-semibold text-sm tracking-wide uppercase mb-3">
                            Veille en temps réel · Source CISA
                        </p>
                        <h2 className="cyna-heading text-gray-100">
                            Les dernières menaces
                            <br />
                            <span className="text-gray-400 font-light">activement exploitées.</span>
                        </h2>
                        {data && (
                            <p className="mt-4 text-gray-500 text-sm">
                                {data.total.toLocaleString("fr-FR")} vulnérabilités répertoriées par la CISA — mise à jour toutes les heures.
                            </p>
                        )}
                    </div>

                    {/* CTA desktop */}
                    <div className="hidden md:flex flex-col gap-3 shrink-0">
                        <Link
                            href="/catalog"
                            className="inline-flex items-center justify-center gap-2 bg-cyna-600 hover:bg-cyna-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
                        >
                            Voir nos solutions
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/support"
                            className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-gray-100 font-medium px-6 py-3 rounded-full transition-colors text-sm bg-transparent"
                        >
                            Demander un audit gratuit
                        </Link>
                    </div>
                </div>

                {/* Grille de tiles */}
                {error ? (
                    <div className="text-center py-16 text-gray-400">
                        <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>Le flux est temporairement indisponible.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {!data
                            ? Array.from({ length: 6 }).map((_, i) => <TileSkeleton key={i} />)
                            : data.vulnerabilities.map((v, i) => (
                                  <TileCard key={v.cveID} v={v} index={i} />
                              ))}
                    </div>
                )}

                {/* CTA mobile */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 md:hidden">
                    <Link
                        href="/catalog"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-cyna-600 hover:bg-cyna-700 text-white font-semibold px-6 py-3.5 rounded-full transition-colors"
                    >
                        Voir nos solutions
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/support"
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-zinc-700 text-gray-300 font-medium px-6 py-3.5 rounded-full transition-colors bg-transparent"
                    >
                        Demander un audit gratuit
                    </Link>
                </div>
            </div>
        </section>
    );
}
