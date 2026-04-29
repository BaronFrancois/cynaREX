"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Activity, ArrowRight, ExternalLink } from "lucide-react";
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

function Tile({ v }: { v: CisaVulnerability }) {
    const isRansomware = v.knownRansomwareCampaignUse === "Known";
    return (
        <a
            href={`https://nvd.nist.gov/vuln/detail/${v.cveID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 flex-1 min-w-0"
        >
            {/* Badge + lien */}
            <div className="flex items-center justify-between gap-2">
                {isRansomware ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Ransomware actif
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyna-600/15 text-cyna-500 border border-cyna-600/25">
                        <ShieldAlert className="w-3 h-3" />
                        Exploitation active
                    </span>
                )}
                <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </div>

            {/* Titre */}
            <div className="flex-1">
                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-violet-200 transition-colors mb-1.5">
                    {v.vulnerabilityName}
                </p>
                <p className="text-white/40 text-xs">
                    {v.vendorProject} — {v.product}
                </p>
            </div>

            {/* Description */}
            <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                {v.shortDescription}
            </p>

            {/* Pied */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <span className="font-mono text-xs text-cyna-500 font-semibold">{v.cveID}</span>
                <span className="text-white/30 text-xs">{formatDate(v.dateAdded)}</span>
            </div>
        </a>
    );
}

function TileSkeleton() {
    return (
        <div className="flex flex-col gap-3 bg-white/[0.05] border border-white/10 rounded-2xl p-5 animate-pulse flex-1">
            <div className="h-6 w-36 bg-white/10 rounded-full" />
            <div className="space-y-2 flex-1">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-4/5 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/10 rounded mt-1" />
            </div>
            <div className="space-y-1.5">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-5/6 bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
            </div>
            <div className="flex justify-between pt-3 border-t border-white/[0.08]">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-3 w-20 bg-white/10 rounded" />
            </div>
        </div>
    );
}

export default function DashboardMockup() {
    const [data, setData] = useState<ThreatFeedData | null>(null);
    const [tick, setTick] = useState(true);

    useEffect(() => {
        fetch("/api/threats")
            .then((r) => r.json())
            .then(setData)
            .catch(() => null);

        const interval = setInterval(() => setTick((t) => !t), 900);
        return () => clearInterval(interval);
    }, []);

    const displayed = data?.vulnerabilities.slice(0, 2) ?? [];

    return (
        <div className="bg-gray-900 rounded-3xl p-4 flex flex-col gap-4">

            {/* Barre du haut */}
            <div className="flex items-center justify-between gap-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-cyna-500 shrink-0" />
                    <span className="text-white/70 text-sm font-medium">
                        {data
                            ? <><span className="text-white font-bold">{data.total.toLocaleString("fr-FR")}</span> vulnérabilités surveillées</>
                            : <span className="text-white/30 text-xs animate-pulse">Chargement du flux…</span>
                        }
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/30 text-xs hidden sm:block">Source : CISA KEV</span>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                        <span
                            className={`w-1.5 h-1.5 rounded-full bg-green-400 transition-opacity duration-300 ${
                                tick ? "opacity-100" : "opacity-20"
                            }`}
                        />
                        <span className="text-green-400 text-xs font-semibold tracking-wide">
                            EN DIRECT
                        </span>
                    </div>
                </div>
            </div>

            {/* Tiles */}
            <div className="flex flex-col sm:flex-row gap-4">
                {!data ? (
                    <>
                        <TileSkeleton />
                        <TileSkeleton />
                    </>
                ) : (
                    displayed.map((v) => <Tile key={v.cveID} v={v} />)
                )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/support"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-sm py-3 rounded-2xl transition-all duration-200"
                >
                    Nous contacter
                </Link>
                <Link
                    href="/catalog"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-cyna-600 hover:bg-cyna-500 text-white font-semibold text-sm py-3 rounded-2xl transition-colors duration-200"
                >
                    Voir les offres
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

        </div>
    );
}
