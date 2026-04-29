// Composant spécifique : Net Sentry
// Affiche l'analyse trafic réseau, la protection DDoS, la prévention d'intrusion et Zero Trust
// Note : ce produit est en maintenance

const TRAFFIC_BARS = [
    { label: "00h", value: 22, anomaly: false },
    { label: "02h", value: 18, anomaly: false },
    { label: "04h", value: 14, anomaly: false },
    { label: "06h", value: 31, anomaly: false },
    { label: "08h", value: 58, anomaly: false },
    { label: "10h", value: 74, anomaly: false },
    { label: "12h", value: 91, anomaly: false },
    { label: "14h", value: 83, anomaly: true },
    { label: "16h", value: 95, anomaly: false },
    { label: "18h", value: 87, anomaly: false },
    { label: "20h", value: 64, anomaly: false },
    { label: "22h", value: 41, anomaly: false },
];

const IDS_EVENTS = [
    { time: "16:04", rule: "ET SCAN Nmap SYN Scan", src: "185.220.101.x", action: "Bloqué", severity: "high" },
    { time: "14:38", rule: "SQL Injection attempt via GET", src: "103.56.212.x", action: "Bloqué", severity: "critical" },
    { time: "12:21", rule: "Brute force FTP — 200 req/s", src: "45.155.205.x", action: "Rate-limité", severity: "medium" },
    { time: "11:55", rule: "DDoS UDP Flood détecté", src: "Multiple IPs", action: "Mitigation auto", severity: "critical" },
];

const SEVERITY_STYLES: Record<string, string> = {
    critical: "bg-red-950/50 text-red-400 border-red-800",
    high: "bg-orange-950/50 text-orange-400 border-orange-800",
    medium: "bg-yellow-950/50 text-yellow-400 border-yellow-800",
};

const ZERO_TRUST_STEPS = [
    { icon: "👤", label: "Identité vérifiée", desc: "SSO + MFA obligatoire" },
    { icon: "📱", label: "Appareil évalué", desc: "Conformité endpoint contrôlée" },
    { icon: "🌐", label: "Contexte analysé", desc: "IP, géolocalisation, heure" },
    { icon: "🔐", label: "Accès minimal accordé", desc: "Least-privilege dynamique" },
    { icon: "👁️", label: "Session surveillée", desc: "Audit continu en temps réel" },
];

export default function NetSentryDetail() {
    const maxValue = Math.max(...TRAFFIC_BARS.map((b) => b.value));

    return (
        <div className="space-y-16">

            {/* Maintenance banner */}
            <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-2xl px-6 py-4 flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">🔧</span>
                <div>
                    <div className="font-semibold text-yellow-400 mb-1">Produit en maintenance planifiée</div>
                    <p className="text-sm text-yellow-500/80">
                        Net Sentry est temporairement indisponible pour une mise à jour majeure de son moteur d'inspection.
                        Les clients existants ne sont pas impactés. Disponibilité prévue : prochainement.
                    </p>
                </div>
            </div>

            {/* Traffic chart */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-3">Analyse du trafic réseau</h2>
                <p className="text-gray-500 mb-8">
                    Inspection approfondie des paquets (DPI) avec détection d'anomalies par apprentissage automatique.
                </p>
                <div className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-sm p-8">
                    <div className="flex items-end justify-between gap-2 h-40 mb-3">
                        {TRAFFIC_BARS.map((bar) => (
                            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full relative flex flex-col justify-end" style={{ height: "100%" }}>
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${bar.anomaly
                                            ? "bg-gradient-to-t from-red-500 to-red-400"
                                            : "bg-gradient-to-t from-orange-400 to-amber-300"
                                            }`}
                                        style={{ height: `${(bar.value / maxValue) * 100}%` }}
                                    />
                                    {bar.anomaly && (
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-red-500 text-xs font-bold">⚠</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-0.5">
                        {TRAFFIC_BARS.map((bar) => (
                            <div key={bar.label} className="flex-1 text-center text-xs text-gray-400">{bar.label}</div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-orange-400 to-amber-300" />
                            Trafic normal
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-red-500 to-red-400" />
                            Anomalie détectée
                        </span>
                    </div>
                </div>
            </div>

            {/* IDS / IPS */}
            <div>
                <h2 className="cyna-heading text-gray-100 mb-6">Prévention d'intrusion (IDS/IPS)</h2>
                <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 px-5 py-4 bg-gray-900 border-b border-gray-800">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-xs text-gray-400 font-mono">net-sentry · ids-monitor</span>
                    </div>
                    <div className="p-6 space-y-3 font-mono text-sm">
                        {IDS_EVENTS.map((e, i) => (
                            <div key={i} className="flex items-center gap-4 bg-gray-900/60 rounded-xl px-4 py-3 border border-gray-800">
                                <span className="text-gray-500 text-xs w-10 flex-shrink-0">{e.time}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${SEVERITY_STYLES[e.severity]}`}>
                                    {e.severity.toUpperCase()}
                                </span>
                                <span className="text-white flex-1 truncate">{e.rule}</span>
                                <span className="text-gray-500 text-xs flex-shrink-0">{e.src}</span>
                                <span className="text-orange-400 text-xs font-semibold flex-shrink-0">{e.action}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DDoS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-orange-950/30 to-red-950/30 rounded-3xl border border-orange-900/50 p-8">
                    <h3 className="text-xl font-bold text-gray-100 mb-5">Protection DDoS</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Capacité de mitigation", value: "5 Tbps", highlight: true },
                            { label: "Temps de détection", value: "< 10 secondes" },
                            { label: "Temps de mitigation", value: "< 30 secondes" },
                            { label: "Attaques bloquées / mois", value: "2 847" },
                            { label: "Disponibilité garantie", value: "99.99%" },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between py-3 border-b border-orange-900/50 last:border-0">
                                <span className="text-sm text-gray-400">{row.label}</span>
                                <span className={`text-sm font-bold ${row.highlight ? "text-orange-400 text-lg" : "text-gray-100"}`}>
                                    {row.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zero Trust */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Accès Zero Trust</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Chaque connexion est vérifiée. Aucune confiance implicite, même sur le réseau interne.
                    </p>
                    <div className="space-y-3">
                        {ZERO_TRUST_STEPS.map((step, i) => (
                            <div key={step.label} className="flex items-center gap-3">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-sm">
                                        {step.icon}
                                    </div>
                                    {i < ZERO_TRUST_STEPS.length - 1 && <div className="w-px h-4 bg-gray-700 mt-1" />}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{step.label}</div>
                                    <div className="text-xs text-gray-400">{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Protocols */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-100 mb-6">Protocoles et couverture</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { proto: "HTTP/S", desc: "Layer 7 inspection" },
                        { proto: "DNS", desc: "Filtrage & tunneling" },
                        { proto: "TLS/SSL", desc: "Décryptage sélectif" },
                        { proto: "SMTP", desc: "Anti-spam & phishing" },
                        { proto: "FTP/SFTP", desc: "Transfert sécurisé" },
                        { proto: "SMB", desc: "Partage réseau sécurisé" },
                        { proto: "RDP", desc: "Accès bureau distant" },
                        { proto: "BGP/OSPF", desc: "Routage protégé" },
                    ].map((item) => (
                        <div key={item.proto} className="bg-zinc-800 rounded-2xl p-4 border border-zinc-700">
                            <div className="font-mono font-bold text-orange-600 text-sm">{item.proto}</div>
                            <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
